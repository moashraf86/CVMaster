import express from "express";
import cors from "cors";
import * as puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import Chromium from "@sparticuz/chromium";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

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

// Define routes here
app.get("/", (req, res) => {
  res.send("Server is running");
});

// POST /pdf route to generate PDF from HTML content
app.post("/pdf", async (req, res) => {
  const { htmlContent } = req.body;

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
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "cvs", format: "pdf" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(pdfBuffer);
    });

    res.json({
      message: "PDF generated and uploaded successfully",
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    console.error("PDF Generation or upload error:", error);
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
});

// check server does not run in serverless environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
}

export default app;
