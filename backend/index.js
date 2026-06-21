import express from "express";
import cors from "cors";
import * as puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import Chromium from "@sparticuz/chromium";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import path from "path";

// Load .env from the backend/ directory, not the CWD the server was
// started from (e.g. when run as `node backend/index.js` from root).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from the specified origin
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST", "OPTIONS"], // Explicitly allow OPTIONS method
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  })
);

// Middleware to handle JSON parsing with increased payload limit
app.use(express.json({ limit: "50mb" }));

/** Cloudinary public_id: alphanumeric, /, _, - only */
function toCloudinaryPublicIdSegment(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Define routes here
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Rate limiter for photo uploads: 10 requests per 15 minutes per IP
const uploadPhotoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { message: "Too many upload requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Separate rate limiter for PDF uploads: 30 requests per 15 minutes per IP
// (higher than photos since downloading CVs is a core user action)
const uploadPdfLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: "Too many PDF upload requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/upload-photo", uploadPhotoLimiter, async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: "Image data is required" });
  }

  try {
    const base64Data = image.includes(",") ? image.split(",")[1] : image;
    const imageBuffer = Buffer.from(base64Data, "base64");

    const maxSize = 2 * 1024 * 1024;
    if (imageBuffer.length > maxSize) {
      return res.status(400).json({
        message: "Image file too large. Maximum size is 2MB.",
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "profile-photos",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      uploadStream.end(imageBuffer);
    });

    if (!uploadResult?.secure_url) {
      throw new Error("Cloudinary upload did not return a URL");
    }

    res.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("Photo upload error:", error);
    res.status(500).json({ message: "Failed to upload photo" });
  }
});

// Upload a PDF (base64 string) to Cloudinary with the given public_id.
// Uses the data URI upload approach — more reliable than upload_stream
// for base64-decoded content. Resolves with the Cloudinary result,
// rejects on error.
function uploadPdfToCloudinary(base64Data, publicId) {
  const dataUri = `data:application/pdf;base64,${base64Data}`;
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      dataUri,
      {
        resource_type: "image",
        folder: "cvs",
        format: "pdf",
        public_id: publicId,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
}

// POST /pdf route to generate PDF from HTML content.
// Returns the raw PDF buffer so the client can download instantly.
// Cloudinary upload is handled separately by POST /upload-pdf.
app.post("/pdf", async (req, res) => {
  const { htmlContent, margin } = req.body;

  if (!htmlContent) {
    return res.status(400).json({ message: "HTML content is required" });
  }

  try {
    let browser;

    if (process.env.NODE_ENV === "development") {
      // Use standard Puppeteer locally
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    if (process.env.NODE_ENV === "production") {
      // Use Puppeteer with Chromium in production
      browser = await puppeteerCore.launch({
        args: Chromium.args,
        defaultViewport: Chromium.defaultViewport,
        executablePath: await Chromium.executablePath(),
        headless: Chromium.headless,
      });
    }

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "a4",
      printBackground: true,
      margin: {
        top: `${margin.VALUE}px`,
        bottom: `${margin.VALUE}px`,
        left: `${margin.VALUE}px`,
        right: `${margin.VALUE}px`,
      },
    });

    await browser.close();

    // Puppeteer 23.x returns a Uint8Array from page.pdf(); Express's
    // res.send() only recognizes Buffer instances, so wrap it explicitly
    // and use res.end() to send raw bytes without body processing.
    res.setHeader("Content-Type", "application/pdf");
    res.end(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("PDF Generation error:", error);
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
});

// POST /upload-pdf route to upload a generated PDF to Cloudinary in the
// background. Acknowledges instantly with 202, then runs the upload after
// the response is sent. Retries exactly once on failure; swallows the
// second failure to the server console only.
app.post("/upload-pdf", uploadPdfLimiter, async (req, res) => {
  const { pdf, name, title, uuid } = req.body;

  if (!pdf || !uuid) {
    return res
      .status(400)
      .json({ message: "PDF data and uuid are required" });
  }

  const fullName = toCloudinaryPublicIdSegment(name) || "cv";
  const fullTitle = toCloudinaryPublicIdSegment(title) || "resume";
  const publicId = `${fullName}_${fullTitle}_${uuid}`;

  // strip data URL prefix if present (e.g. "data:application/pdf;base64,...")
  const base64Data = pdf.includes(",") ? pdf.split(",")[1] : pdf;

  // Acknowledge instantly. On @vercel/node the async handler continues
  // running after the response is flushed, keeping the function alive
  // until the upload completes or maxDuration is hit. This is best-effort
  // — if the platform terminates the function early, the upload is lost
  // (acceptable per the silent-background-upload design).
  res.status(202).json({ message: "Upload queued" });

  try {
    await uploadPdfToCloudinary(base64Data, publicId);
  } catch (firstError) {
    console.error("Cloudinary upload failed, retrying:", firstError);
    try {
      await uploadPdfToCloudinary(base64Data, publicId);
    } catch (secondError) {
      console.error(
        "Cloudinary upload failed after retry:",
        secondError
      );
    }
  }
});

// check server does not run in serverless environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
}

export default app;
