import { useState } from "react";
import { toast } from "./use-toast";
import { usePdfSettings, useResume } from "../store/useResume";
import { ValidatedData } from "./useFileValidation";

export const useFileImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { setData } = useResume();
  const { setValue } = usePdfSettings();

  const importData = async (
    validatedData: ValidatedData | null,
    onSuccess?: () => void
  ) => {
    if (!validatedData) {
      toast({
        title: "No data to import",
        description: "Please validate the file first",
      });
      return false;
    }

    try {
      setIsImporting(true);

      // Simulate a delay (to be removed in future enhancement)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // set the resume data
      setData({
        ...validatedData,
      });

      // set the pdf settings to the pdf settings in the validated data
      setValue("fontFamily", validatedData.pdfSettings.fontFamily);
      setValue("fontSize", validatedData.pdfSettings.fontSize);
      setValue("fontCategory", validatedData.pdfSettings.fontCategory);
      setValue("lineHeight", validatedData.pdfSettings.lineHeight);
      setValue("verticalSpacing", validatedData.pdfSettings.verticalSpacing);

      toast({
        title: "File imported successfully",
        description: "You can now edit the imported data",
      });

      onSuccess?.();
      return true;
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Error while importing the file",
        description: "Please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    importData,
  };
};
