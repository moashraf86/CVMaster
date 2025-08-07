// hooks/useFileImport.ts
import { useState } from "react";
import { toast } from "./use-toast";
import { useResume } from "../store/useResume";
import { ValidatedData } from "./useFileValidation";

export const useFileImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { setData } = useResume();

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

      setData(validatedData);

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
