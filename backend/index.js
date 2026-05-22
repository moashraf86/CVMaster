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
const isProduction = process.env.NODE_ENV === "production";

let browserPromise = null;

function logPdfTiming(step, startedAt) {
  const ms = Date.now() - startedAt;
  console.log(`[pdf] ${step}: ${ms}ms`);
  return Date.now();
}

async function getBrowser() {
  if (browserPromise) {
    try {
      const browser = await browserPromise;
      if (browser.isConnected()) {
        return browser;
      }
    } catch {
      browserPromise = null;
    }
  }

  const launchStartedAt = Date.now();
  browserPromise = isProduction
    ? puppeteerCore.launch({
        args: Chromium.args,
        defaultViewport: Chromium.defaultViewport,
        executablePath: await Chromium.executablePath(),
        headless: Chromium.headless,
      })
    : puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

  const browser = await browserPromise;
  logPdfTiming("browser_launch", launchStartedAt);
  return browser;
}

// Configure CORS to allow requests from the specified origin
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST", "OPTIONS"], // Explicitly allow OPTIONS method
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  }),
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

// POST /pdf route to generate PDF from HTML content
app.post("/pdf", async (req, res) => {
  const {
    htmlContent,
    name,
    title,
    margin,
    uploadToCloudinary = true,
  } = req.body;
  const requestStartedAt = Date.now();
  let stepStartedAt = requestStartedAt;

  const fullName = toCloudinaryPublicIdSegment(name) || "cv";
  const fullTitle = toCloudinaryPublicIdSegment(title) || "resume";

  function generateId() {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    const randomId = crypto.randomUUID().replace(/-/g, "").slice(0, 6);

    return `${day}-${month}-${year}_${randomId}`;
  }

  const uuid = generateId();
  const marginValue = margin?.VALUE ?? 0;

  if (!htmlContent) {
    return res.status(400).json({ message: "HTML content is required" });
  }

  let page;

  try {
    const browser = await getBrowser();
    stepStartedAt = logPdfTiming("get_browser", stepStartedAt);

    page = await browser.newPage();
    stepStartedAt = logPdfTiming("new_page", stepStartedAt);

    await page.setContent(htmlContent, {
      waitUntil: "load",
      timeout: 15000,
    });
    stepStartedAt = logPdfTiming("set_content", stepStartedAt);

    await page.evaluate(() => document.fonts?.ready);
    stepStartedAt = logPdfTiming("fonts_ready", stepStartedAt);

    const pdfBytes = await page.pdf({
      format: "a4",
      printBackground: true,
      margin: {
        top: `${marginValue}px`,
        bottom: `${marginValue}px`,
        left: `${marginValue}px`,
        right: `${marginValue}px`,
      },
    });
    stepStartedAt = logPdfTiming("page_pdf", stepStartedAt);

    await page.close();
    page = null;

    const pdfBuffer = Buffer.from(pdfBytes);
    const fileName = `${fullName}_${fullTitle}_${uuid}.pdf`;

    if (uploadToCloudinary) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "cvs",
            format: "pdf",
            public_id: `${fullName}_${fullTitle}_${uuid}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        uploadStream.end(pdfBuffer);
      });
      logPdfTiming("cloudinary_upload", stepStartedAt);

      if (!uploadResult?.secure_url) {
        throw new Error("Cloudinary upload did not return a URL");
      }

      res.setHeader("X-Cloudinary-Url", uploadResult.secure_url);
      res.setHeader("Access-Control-Expose-Headers", "X-Cloudinary-Url");
    }

    logPdfTiming("total_direct", requestStartedAt);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    return res.end(pdfBuffer);
  } catch (error) {
    if (page) {
      await page.close().catch(() => {});
    }
    console.error("PDF Generation or upload error:", error);
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
});

// check server does not run in serverless environment
if (!isProduction) {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });

  process.on("SIGINT", async () => {
    if (browserPromise) {
      const browser = await browserPromise.catch(() => null);
      await browser?.close().catch(() => {});
    }
    process.exit(0);
  });
}

export default app;
