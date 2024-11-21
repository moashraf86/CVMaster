const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

/**
 * Cloundinary configuration
 */
(async function () {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
  });
})();

const app = express();
const PORT = 5000;

// Enable CORS (allow requests from frontend at localhost:5173)
app.use(cors({ origin: "http://localhost:5173" }));

// Parse JSON requests
app.use(express.json());

// POST route for PDF generation
app.post("/pdf", async (req, res) => {
  const { htmlContent } = req.body;

  if (!htmlContent) {
    return res.status(400).send({ message: "HTML content is required" });
  }

  try {
    // Launch the browser (Puppeteer will automatically download Chromium)
    const browser = await puppeteer.launch({
      headless: true, // Headless mode (can be set to false for debugging)
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Useful for running in a server environment
    });

    // Create a new page in the browser
    const page = await browser.newPage();

    // Set the page content to the HTML content
    await page.setContent(htmlContent);

    // Generate a PDF from the HTML content
    const pdfDocument = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "6mm",
        bottom: "6mm",
      },
    });

    // Close the browser instance after PDF generation
    await browser.close();

    //upload the screenshot to cloudinary
    const resource = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "pdfs",
            format: "pdf",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(pdfDocument);
    });
    // send the source back to the client
    console.log(resource);
    res.send({ resource });
  } catch (error) {
    console.error("PDF Generation error:", error);
    // Respond with a 500 error and a message
    res
      .status(500)
      .send({ message: "Internal server error: " + error.message });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
