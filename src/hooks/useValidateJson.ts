// hooks/useFileValidation.ts
import { useState } from "react";
import { toast } from "./use-toast";
import { cvMasterSchema } from "../lib/schema";
import { z } from "zod";

const cvMasterJsonSchema = cvMasterSchema.pick({
  basics: true,
  summary: true,
  experience: true,
  projects: true,
  education: true,
  skills: true,
  languages: true,
  certifications: true,
  awards: true,
  volunteering: true,
  sectionTitles: true,
  pdfSettings: true,
});

export type ValidatedData = z.infer<typeof cvMasterJsonSchema>;

export const useValidateJson = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validatedData, setValidatedData] = useState<ValidatedData | null>(
    null
  );

  const validateFile = async (file: File | null) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to validate",
      });
      return false;
    }

    try {
      setIsValidating(true);
      setError(null);
      // Simulate a delay (to be removed in future enhancement)
      await new Promise((resolve) => setTimeout(resolve, 500));
      await validateCvMasterJson(file);
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      toast({
        title: "Error while validating the file",
        description: "Please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const validateCvMasterJson = async (file: File): Promise<boolean> => {
    if (file.type !== "application/json") {
      const errorMsg =
        "Invalid file format. Please select a valid CV Master JSON file";
      // setError(errorMsg);
      toast({
        title: "Invalid file format",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }

    const fileContent = await file.text();
    const json = JSON.parse(fileContent);
    const parseResult = cvMasterJsonSchema.safeParse(json);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      setError(errorMsg);
      toast({
        title: "Invalid CV Master JSON structure",
        description: "The file doesn't match the expected format",
        variant: "destructive",
      });
      return false;
    }

    setIsValid(true);
    setValidatedData(parseResult.data);
    return true;
  };

  const resetValidation = () => {
    setIsValid(false);
    setError(null);
    setValidatedData(null);
  };

  return {
    isValidating,
    isValid,
    error,
    validatedData,
    validateFile,
    resetValidation,
    setError,
  };
};
