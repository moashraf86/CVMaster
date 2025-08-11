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
import { CheckIcon, Loader2 } from "lucide-react";
import { useFileValidation } from "../../../hooks/useFileValidation";
import { useFileImport } from "../../../hooks/useFileImport";

interface ImportCvDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportCvDialog: React.FC<ImportCvDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [fileType, setFileType] = useState<string>("cv-master-json");
  const [file, setFile] = useState<File | null>(null);

  const {
    isValidating,
    isValid,
    error,
    validatedData,
    validateFile,
    resetValidation,
    setError,
  } = useFileValidation();

  const { isImporting, importData } = useFileImport();

  const handleValidate = async () => {
    await validateFile(file, fileType);
  };

  const handleImport = async () => {
    await importData(validatedData, onClose);
  };

  const handleTryAgain = () => {
    setError(null);
    resetValidation();
  };

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setFileType("cv-master-json");
      resetValidation();
    }
  }, [isOpen, resetValidation]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import an existing CV</DialogTitle>
          <DialogDescription>
            Upload a file from one of the accepted formats to parse existing
            data and import it to CV Master.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Select
            value={fileType}
            onValueChange={setFileType}
            defaultValue="cv-master-json"
          >
            <Label htmlFor="file-type" className="w-fit">
              File type
            </Label>
            <SelectTrigger id="file-type">
              <SelectValue placeholder="Select a file" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cv-master-json">
                CV Master JSON (.json)
              </SelectItem>
              <SelectItem value="json" disabled>
                JSON (.json) (Coming soon)
              </SelectItem>
              <SelectItem value="pdf" disabled>
                PDF (.pdf) (Coming soon)
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="space-y-1">
            <Label>File</Label>
            <Input
              type="file"
              accept=".json,.pdf"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFile(e.target.files?.[0] || null)
              }
            />
            <span className="text-xs text-muted-foreground">
              Accepts only: .json, .pdf
            </span>
          </div>
        </div>
        {/* if error, show the error message */}
        {error && (
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-red-500">Error</Label>
            <div className="whitespace-pre-wrap rounded bg-secondary p-4 font-mono text-xs leading-relaxed">
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
              {isValid && (
                <Button onClick={handleImport} disabled={!file}>
                  {isImporting ? (
                    <>
                      Importing... <Loader2 className="ml-2 animate-spin" />
                    </>
                  ) : (
                    "Import"
                  )}
                </Button>
              )}
              <Button
                onClick={handleValidate}
                disabled={!file || isValid || isImporting}
                variant={isValid ? "success" : "default"}
              >
                {isValidating ? (
                  <>
                    Validating... <Loader2 className="ml-2 animate-spin" />
                  </>
                ) : (
                  <>
                    {isValid && <CheckIcon />}
                    {isValid ? "Validated" : "Validate"}
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
