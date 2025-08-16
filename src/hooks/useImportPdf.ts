import { useState } from "react";
import { toast } from "./use-toast";
import { generateJSONFromText } from "../services/groqService";
// import { ResumeType } from "../types/types";
import { usePdfSettings, useResume } from "../store/useResume";

interface ExtractResult {
  text: string;
  pageCount: number;
}

export const useImportPDF = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const { setData } = useResume();
  const { setValue } = usePdfSettings();

  // Load PDF.js from CDN
  const loadPDFJS = async () => {
    // Check if PDF.js is already loaded
    // @ts-expect-error - pdfjsLib is not defined in the global scope
    if (window.pdfjsLib) return window.pdfjsLib;

    // if exists
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        // @ts-expect-error - pdfjsLib is not defined in the global scope
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        // @ts-expect-error - pdfjsLib is not defined in the global scope
        resolve(window.pdfjsLib);
      };
      script.onerror = () => reject(new Error("Failed to load PDF.js"));
      document.head.appendChild(script);
    });
  };

  // Extract text from PDF
  const extractTextFromPDF = async (file: File): Promise<ExtractResult> => {
    try {
      const pdfjsLib = await loadPDFJS();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
      }).promise;

      let fullText = "";
      const totalPages = pdf.numPages;

      // Process pages with progress updates for large PDFs
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (totalPages > 5 && pageNum % 5 === 0) {
          toast({
            title: "Processing PDF...",
            description: `Processing page ${pageNum} of ${totalPages}`,
          });
        }

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item: { str: string }) => {
            if ("str" in item) {
              return item.str;
            }
            return "";
          })
          .filter((text: string) => text.trim().length > 0)
          .join(" ");

        fullText += pageText + "\n";
        page.cleanup();
      }

      pdf.cleanup();

      const cleanedText = fullText.trim();
      if (!cleanedText || cleanedText.length < 10) {
        throw new Error(
          "The PDF appears to be empty or contains mostly images. Try using the image import feature instead."
        );
      }

      return {
        text: cleanedText,
        pageCount: totalPages,
      };
    } catch (error) {
      console.error("PDF extraction error:", error);

      if (error instanceof Error) {
        if (error.message.includes("Invalid PDF")) {
          throw new Error(
            "Invalid PDF file. Please ensure the file is not corrupted."
          );
        } else if (error.message.includes("Password")) {
          throw new Error(
            "Password-protected PDFs are not supported. Please provide an unlocked PDF."
          );
        } else if (
          error.message.includes("empty") ||
          error.message.includes("images")
        ) {
          throw error; // Re-throw our custom error
        }
      }

      throw new Error(
        "Failed to extract text from PDF. The file might be corrupted, password-protected, or image-based."
      );
    }
  };

  // Get current status for UI
  const getStatus = () => {
    if (!isImporting) return { status: "idle", text: "Import & Analyze" };
    if (isProcessing)
      return { status: "processing", text: "Processing PDF..." };
    return { status: "importing", text: "Importing PDF..." };
  };

  // Validate PDF file
  const validateFile = (file: File): void => {
    if (file.type.toLowerCase() !== "application/pdf") {
      throw new Error(
        "Invalid file type. This hook only supports PDF files. Use useImageImport for images."
      );
    }

    // Check file size limit - 20MB for PDFs
    const maxSize = 20 * 1024 * 1024; // 20MB

    if (file.size > maxSize) {
      throw new Error(
        "PDF file too large. Please select a PDF file smaller than 20MB."
      );
    }

    if (file.size < 1024) {
      // 1KB minimum
      throw new Error(
        "PDF file too small. Please select a valid PDF document."
      );
    }
  };

  // Import PDF data
  // Main import function for PDFs
  const importPDFData = async (file: File): Promise<boolean> => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to import.",
        variant: "destructive",
      });
      return false;
    }

    try {
      validateFile(file);
      setIsImporting(true);

      toast({
        title: "Processing PDF...",
        description: "Extracting text from your PDF document.",
      });

      // Extract text from PDF
      const extractResult = await extractTextFromPDF(file);
      setExtractedText(extractResult.text);

      if (extractResult.text.length < 50) {
        throw new Error(
          "Insufficient text content found. The PDF might be mostly images, very short, or scanned. Try using the image import feature instead."
        );
      }

      // Analyze and structure the text
      setIsProcessing(true);
      toast({
        title: "Processing PDF...",
        description: "AI is parsing your PDF data. Almost done!",
      });

      // Structure the extracted text using AI
      const structuredData = await generateJSONFromText(extractResult.text);

      // Update resume data
      if (structuredData) {
        setData(structuredData);
        setValue("fontFamily", structuredData.pdfSettings.fontFamily);
        setValue("fontSize", structuredData.pdfSettings.fontSize);
        setValue("fontCategory", structuredData.pdfSettings.fontCategory);
        setValue("lineHeight", structuredData.pdfSettings.lineHeight);
        setValue("verticalSpacing", structuredData.pdfSettings.verticalSpacing);
        setValue("margin", structuredData.pdfSettings.margin);
        // Success toast
        toast({
          title: "PDF imported successfully!",
          description: `Your ${extractResult.pageCount}-page PDF has been processed and is ready to use.`,
          variant: "default",
        });

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("PDF import error:", error);

      let errorMessage =
        "An unexpected error occurred while processing the PDF.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "PDF import failed",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    } finally {
      resetImport();
    }
  };

  // Reset state
  const resetImport = () => {
    setExtractedText("");
    setIsProcessing(false);
    setIsImporting(false);
  };

  return {
    isImporting,
    extractedText,
    isProcessing,
    getStatus,
    importPDFData,
    resetImport,
  };
};
