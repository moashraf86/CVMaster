import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import {
  CheckIcon,
  Loader2,
  FileText,
  AlertTriangle,
  FileImage,
  Image,
  Upload,
  ScanText,
  FileScan,
} from "lucide-react";
import { useValidateJson } from "../../../hooks/useValidateJson";
import { useImportJSON } from "../../../hooks/useImportJson";
import { useImportPDF } from "../../../hooks/useImportPdf";
import { useImportImage } from "../../../hooks/useImportImage";

interface ImportCvDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportCvDialog: React.FC<ImportCvDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [fileType, setFileType] = useState<string>("pdf");
  const [file, setFile] = useState<File | null>(null);

  // Validation for JSON files
  const {
    isValidating,
    isValid,
    error,
    validatedData,
    validateFile,
    resetValidation,
    setError,
  } = useValidateJson();

  const { isImporting: isImportingJSON, importJSONData } = useImportJSON();
  const {
    isImporting: isImportingPDF,
    importPDFData,
    extractedText,
    resetImport: resetPDFImport,
    getStatus: getPDFStatus,
  } = useImportPDF();

  const {
    isImporting: isImportingImage,
    importImageData,
    isProcessing: isProcessingImage,
    getStatus,
    resetImport: resetImageImport,
  } = useImportImage();

  // Validate JSON
  const handleValidate = async () => {
    if (!file) return;
    await validateFile(file);
  };

  // Import JSON
  const handleImportJSON = async () => {
    if (!validatedData) return;
    const success = await importJSONData(validatedData);
    if (success) {
      resetValidation();
      setFile(null);
      onClose();
    }
  };

  // Import PDF
  const handleImportPDF = async () => {
    if (!file) return;
    const success = await importPDFData(file);
    if (success) {
      resetPDFImport();
      setFile(null);
      onClose();
    }
  };

  // Import Image
  const handleImportImage = async () => {
    if (!file) return;
    const success = await importImageData(file);
    if (success) {
      resetImageImport();
      setFile(null);
      onClose();
    }
  };

  // Try again
  const handleTryAgain = () => {
    setError(null);
    resetValidation();
    resetPDFImport();
    resetImageImport();
    setFile(null);
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    // Reset validations when file changes
    resetValidation();
    resetPDFImport();
    resetImageImport();
  };

  // Handle file type change
  const handleFileTypeChange = (newFileType: string) => {
    setFileType(newFileType);
    setFile(null);
    resetValidation();
    resetPDFImport();
    resetImageImport();
  };

  // Reset state
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setFileType("pdf");
      resetValidation();
      resetPDFImport();
      resetImageImport();
    }
  }, [isOpen, resetValidation, resetPDFImport, resetImageImport]);

  // Get accept types
  const getAcceptTypes = () => {
    switch (fileType) {
      case "pdf":
        return ".pdf";
      case "image":
        return ".png,.jpg,.jpeg";
      case "cv-master-json":
        return ".json";
      default:
        return ".json,.pdf,.png,.jpg,.jpeg";
    }
  };

  const isProcessing =
    isValidating || isImportingJSON || isImportingPDF || isProcessingImage;

  // Get the current image import status
  const imageStatus = getStatus();
  const pdfStatus = getPDFStatus();

  // Get button content based on file type and status
  const getButtonContent = () => {
    switch (fileType) {
      case "pdf":
        if (!isImportingPDF) {
          return (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Import & Analyze
            </>
          );
        }
        switch (pdfStatus.status) {
          case "processing":
            return (
              <>
                <FileScan className="mr-2 h-4 w-4 animate-pulse" />
                {pdfStatus.text}
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            );
          default:
            return (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Import & Analyze
              </>
            );
        }

      case "image":
        if (!isImportingImage) {
          return (
            <>
              <Image className="mr-2 h-4 w-4" />
              Import & Analyze
            </>
          );
        }

        switch (imageStatus.status) {
          case "processing":
            return (
              <>
                <ScanText className="mr-2 h-4 w-4 animate-pulse" />
                AI Scanning...
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            );
          case "importing":
            return (
              <>
                <Upload className="mr-2 h-4 w-4 animate-pulse" />
                Importing Image...
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            );
          default:
            return (
              <>
                Importing Image...
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            );
        }

      default:
        return "Import";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Import an existing CV</DialogTitle>
          <DialogDescription>
            Upload a file from one of the accepted formats to parse existing
            data and import it to CV Master.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Select
              value={fileType}
              onValueChange={handleFileTypeChange}
              disabled={isProcessing}
            >
              <Label htmlFor="file-type" className="w-fit">
                File type
              </Label>
              <SelectTrigger id="file-type">
                <SelectValue placeholder="Select a file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF, Word (.pdf, .docx) - High accuracy
                  </div>
                </SelectItem>
                <SelectItem value="image">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    Image (.png, .jpg, .jpeg) - Medium accuracy
                  </div>
                </SelectItem>
                <SelectItem value="cv-master-json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CV Master JSON (.json) - Fastest & most accurate
                  </div>
                </SelectItem>
                <SelectItem value="json" disabled>
                  Generic JSON (.json) (Coming soon)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>File</Label>
            <Input
              type="file"
              accept={getAcceptTypes()}
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>
                Accepts:{" "}
                {fileType === "pdf"
                  ? "PDF files"
                  : fileType === "image"
                  ? "Image files (PNG, JPG, JPEG, etc.)"
                  : "JSON files"}
                {(fileType === "pdf" || fileType === "image") &&
                  " (AI will extract and structure the data)"}
              </span>
            </div>
          </div>
          {/* Show extracted text preview for PDF */}
          {fileType === "pdf" && extractedText && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Extracted Text Preview
              </Label>
              <div className="max-h-32 overflow-y-auto rounded border bg-muted p-3">
                <pre className="text-xs whitespace-pre-wrap">
                  {extractedText.substring(0, 1000)}
                  {extractedText.length > 1000 && "..."}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <Label className="text-sm text-red-500 font-medium">Error</Label>
            </div>
            <div className="whitespace-pre-wrap rounded bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        <DialogFooter>
          {error ? (
            <Button variant="outline" onClick={handleTryAgain}>
              Try again
            </Button>
          ) : (
            <div className="flex w-full justify-end gap-2">
              {/* JSON Import Flow */}
              {(fileType === "cv-master-json" || fileType === "json") && (
                <>
                  {isValid && (
                    <Button
                      onClick={handleImportJSON}
                      disabled={!validatedData || isImportingJSON}
                    >
                      {isImportingJSON ? (
                        <>
                          Importing...{" "}
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        "Import"
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={handleValidate}
                    disabled={!file || isValid || isProcessing}
                    variant={isValid ? "secondary" : "default"}
                  >
                    {isValidating ? (
                      <>
                        Validating...{" "}
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        {isValid && <CheckIcon className="mr-2 h-4 w-4" />}
                        {isValid ? "Validated" : "Validate"}
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* PDF Import Flow */}
              {fileType === "pdf" && (
                <Button
                  onClick={handleImportPDF}
                  disabled={!file || isImportingPDF}
                >
                  {getButtonContent()}
                </Button>
              )}

              {/* Image Import Flow */}
              {fileType === "image" && (
                <Button
                  onClick={handleImportImage}
                  disabled={!file || isImportingImage}
                  className="min-w-[160px]" // Fixed width to prevent button jumping
                >
                  {getButtonContent()}
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
