import { useState } from "react";
import { toast } from "./use-toast";
import { generateJSONFromImage } from "../services/groqService";
import { usePdfSettings, useResume } from "../store/useResume";
import { PdfSettings, ResumeType } from "../types/types";

// Types
interface ImportStatus {
  status: "idle" | "importing" | "processing";
  text: string;
}

interface ImageProcessResult {
  structuredData: ResumeType["resumeData"] & {
    pdfSettings: PdfSettings["pdfSettings"];
  };
}

export const useImportImage = () => {
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const { setData } = useResume();
  const { setValue } = usePdfSettings();

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Extract and structure data from images using Groq Vision API
  const processImageWithAI = async (
    file: File
  ): Promise<ImageProcessResult> => {
    try {
      // Show initial processing toast
      setIsProcessing(true);

      setIsAnalyzing(true);
      toast({
        title: "Scanning image...",
        description: "AI is scanning the image. Almost done!",
      });

      // Convert file to base64 for API call
      const base64Image = await fileToBase64(file);

      // Use Groq Vision API to extract structured data directly
      const structuredData = await generateJSONFromImage(
        base64Image,
        file.type
      );

      if (!structuredData || Object.keys(structuredData).length === 0) {
        throw new Error(
          "Could not extract meaningful resume data from the image. The image might be too blurry, low resolution, or not contain resume content."
        );
      }

      toast({
        title: "Image scanned successfully!",
        description: "AI has scanned the image and extracted the resume data.",
      });

      return {
        structuredData,
      };
    } catch (error) {
      console.error("Image processing error:", error);

      throw new Error(
        "AI-powered image processing failed. The image might be corrupted, too complex, or contain no readable text."
      );
    } finally {
      resetImport();
    }
  };

  // Get current status for UI
  const getStatus = (): ImportStatus => {
    if (!isImporting) return { status: "idle", text: "Import & Analyze" };
    if (isProcessing)
      return { status: "processing", text: "Processing with AI..." };
    return { status: "importing", text: "Uploading Image..." };
  };

  // Validate image file
  const validateFile = (file: File): void => {
    const supportedTypes = ["image/png", "image/jpg", "image/jpeg"];

    if (!supportedTypes.includes(file.type.toLowerCase())) {
      throw new Error(
        "Invalid file type. This hook only supports PNG, JPG, and JPEG images. Use usePDFImport for PDF files."
      );
    }

    // Check file size limit - 4MB for base64 images (Groq constraint)
    const maxSize = 4 * 1024 * 1024; // 4MB

    if (file.size > maxSize) {
      throw new Error(
        "Image file too large. Please select an image smaller than 4MB."
      );
    }

    if (file.size < 10 * 1024) {
      // 10KB minimum for meaningful images
      throw new Error(
        "Image file too small. Please select a valid image file with readable content."
      );
    }
  };

  // Main import function for images
  const importImageData = async (file: File): Promise<boolean> => {
    if (!file) {
      toast({
        title: "No file selected",
        description:
          "Please select an image file (PNG, JPG, or JPEG) to import.",
        variant: "destructive",
      });
      return false;
    }

    try {
      validateFile(file);
      setIsImporting(true);

      toast({
        title: "Uploading image...",
        description: "Preparing your image for AI processing.",
      });

      // Process image with AI Vision
      setIsProcessing(true);
      const processResult = await processImageWithAI(file);

      // Update resume data with structured data from AI
      const { structuredData } = processResult;

      setData(structuredData);
      // set the pdf settings to the pdf settings in the validated data
      setValue("fontFamily", structuredData.pdfSettings.fontFamily);
      setValue("fontSize", structuredData.pdfSettings.fontSize);
      setValue("fontCategory", structuredData.pdfSettings.fontCategory);
      setValue("pdfSettings.lineHeight", structuredData.pdfSettings.lineHeight);
      setValue(
        "pdfSettings.verticalSpacing",
        structuredData.pdfSettings.verticalSpacing
      );
      setValue("pdfSettings.margin", structuredData.pdfSettings.margin);

      // Success toast
      toast({
        title: "Image imported successfully!",
        description:
          "Your resume image has been processed with AI and is ready to use.",
        variant: "success",
      });

      return true;
    } catch (error) {
      console.error("Image import error:", error);

      let errorMessage =
        "An unexpected error occurred while processing the image.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Image import failed",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    } finally {
      resetImport();
    }
  };

  // Reset state
  const resetImport = (): void => {
    setExtractedText("");
    setIsProcessing(false);
    setIsImporting(false);
    setIsAnalyzing(false);
  };

  return {
    isImporting,
    extractedText,
    isProcessing,
    isAnalyzing,
    getStatus,
    importImageData,
    resetImport,
  };
};
