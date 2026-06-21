import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Download, FileJson, FileText } from "lucide-react";

interface DownloadOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  downloadPdf: () => void;
  downloadJson: () => void;
  isGenerating?: boolean;
  isSuccess?: boolean;
}

const LoadingState = () => (
  <div
    className="flex flex-col items-center justify-center py-12 gap-4"
    role="status"
    aria-live="polite"
  >
    <div className="relative flex items-center justify-center h-16 w-16">
      <svg
        className="absolute inset-0 animate-spin duration-[1.5s]"
        viewBox="0 0 50 50"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray="80 126"
          className="text-primary"
        />
      </svg>
      <Download className="relative size-7 text-primary" />
    </div>
    <div className="text-center space-y-1">
      <p className="font-medium text-foreground">Generating your PDF...</p>
      <p className="text-sm text-muted-foreground">
        This usually takes a few seconds.
      </p>
    </div>
  </div>
);

const SuccessState = () => (
  <div
    className="flex flex-col items-center justify-center py-12 gap-4"
    role="status"
    aria-live="polite"
  >
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10">
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7 text-green-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </div>
    <div className="text-center space-y-1">
      <p className="font-medium text-foreground">PDF downloaded!</p>
      <p className="text-sm text-muted-foreground">
        Check your downloads folder.
      </p>
    </div>
  </div>
);

export const DownloadOptionsDialog: React.FC<DownloadOptionsDialogProps> = ({
  isOpen,
  onClose,
  downloadPdf,
  downloadJson,
  isGenerating = false,
  isSuccess = false,
}) => {
  const isBusy = isGenerating || isSuccess;

  return (
    <Dialog open={isOpen} onOpenChange={isBusy ? undefined : onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-lg">
        {isBusy ? (
          isGenerating ? (
            <LoadingState />
          ) : (
            <SuccessState />
          )
        ) : (
          <>
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
                    Download a JSON file of your CV. This file can be used to
                    import your CV later or import into other applications.
                  </p>
                </div>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
