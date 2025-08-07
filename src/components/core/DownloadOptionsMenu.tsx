import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FileJson, FileText } from "lucide-react";

interface DownloadOptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  downloadPdf: () => void;
  downloadJson: () => void;
}

export const DownloadOptionsMenu: React.FC<DownloadOptionsMenuProps> = ({
  isOpen,
  onClose,
  downloadPdf,
  downloadJson,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Download Options</DialogTitle>
          <DialogDescription>
            Download your CV in PDF or JSON format.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          <Button
            onClick={downloadPdf}
            variant="outline"
            className="flex items-start justify-start gap-3 h-auto w-full p-4"
          >
            <FileText className="!size-5 mt-0.5" />
            <div className="space-y-2 text-start text-sm">
              <p className="font-bold">PDF</p>
              <p className="text-muted-foreground text-wrap">
                Download a PDF of your CV. This file can be used to print or
                share with recruiters or upload to job boards.
              </p>
            </div>
          </Button>
          <Button
            onClick={downloadJson}
            variant="outline"
            className="flex items-start justify-start gap-3 h-auto w-full p-4"
          >
            <FileJson className="!size-5 mt-0.5" />
            <div className="space-y-2 text-start text-sm">
              <p className="font-bold">JSON</p>
              <p className="text-muted-foreground text-wrap">
                Download a JSON file of your CV. This file can be used to import
                your CV later or import into other applications.
              </p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
