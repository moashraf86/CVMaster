import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Button } from "../ui/button";
import { Download, LoaderCircle } from "lucide-react";
import { Page } from "../preview";
import { useCallback, useState } from "react";
import { toast } from "../../hooks/use-toast";
import { Basics } from "../../types/types";
import { usePdfSettings, useResume } from "../../store/useResume";
import { cn } from "../../lib/utils";
import { DownloadOptionsDialog } from "./dialogs/DownloadOptionsDialog";
import { buildFontCssUrl } from "../../lib/googleFonts";

interface DownloadCVProps {
  className?: string;
  type?: "icon" | "button";
}

// Convert a Blob to a base64 string via FileReader.
// Mirrors the photo-upload pattern in sections/basics.tsx and avoids
// the btoa spread-argument stack overflow on large blobs.
const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

export const DownloadCV: React.FC<DownloadCVProps> = ({ className, type }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { resumeData, hiddenItemIds } = useResume();
  const {
    pdfSettings: {
      fontFamily,
      fontSize,
      fontCategory,
      lineHeight,
      scale,
      verticalSpacing,
      margin,
      skillsLayout,
    },
  } = usePdfSettings();
  const { basics } = resumeData;

  // Render the print version of the page into a detached div and return the HTML.
  // Re-rendered on every call so the latest state (e.g. hiddenInPdf) is reflected.
  const renderPrintHtml = useCallback((): string => {
    const div = document.createElement("div");
    const root = createRoot(div);
    flushSync(() => {
      root.render(
        <>
          <Page mode="print" />
        </>
      );
    });
    return div.innerHTML;
  }, []);

  // render CVPreview component to HTML
  const getHtmlContent = () => {
    return `<html>
			<head>
				<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
				<link href="${buildFontCssUrl(fontFamily, ["400", "700"])}" rel="stylesheet">
			</head>
			<style>
					:root {
						--resume-font-family: ${fontFamily};
					}

					body {
						font-family: var(--resume-font-family);
					}

					ul {
						list-style-type: disc;
						padding-left: 2rem;
						line-height: inherit;
					}

					ol {
						list-style-type: decimal;
						padding-left: 2rem;
						line-height: inherit;
					}
					a {
						text-decoration: underline;
					}
			</style>
			<body>
				<!-- Add other dynamic sections here with Tailwind classes -->
				${renderPrintHtml()}
			</body>
		</html>`;
  };

  // validate the basics
  const validateBasics = (basics: Basics) => {
    const { name, title, email } = basics;
    if (!name || !title || name.length === 0 || title.length === 0) {
      throw new Error("Name and title are required");
    }
    // check if email is valid
    if (!email || !email.includes("@")) {
      throw new Error("Email is required and must be valid");
    }
  };

  const downloadPdf = async () => {
    try {
      // close the menu
      setIsDialogOpen(false);

      setIsLoading(true);

      // check if user is offline
      if (!navigator.onLine) {
        throw new Error(
          "You are offline. Please check your internet connection."
        );
      }

      // validate the basics
      validateBasics(basics);

      // get the html content
      const htmlContent = getHtmlContent();

      // send the html content to the server to generate the PDF
      const api = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${api}/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent,
          margin,
        }),
      });

      // check if the response is ok
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to generate PDF.");
      }

      // verify the server actually sent a PDF, not an unexpected JSON
      // error with a 200 status
      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/pdf")) {
        throw new Error("Server did not return a PDF.");
      }

      // get the PDF as a blob and trigger an instant local download
      const pdfBlob = await res.blob();
      if (pdfBlob.size === 0) {
        throw new Error("Received empty PDF from server.");
      }
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${basics.name}-${basics.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // delay revoking the blob URL — link.click() queues the download
      // asynchronously, and revoking too early produces a corrupt file
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      // generate a uuid for the Cloudinary public_id to ensure uniqueness
      const uuid = crypto.randomUUID();

      // fire the background upload to Cloudinary without awaiting it
      // in the UI flow. Note: keepalive is intentionally omitted —
      // browsers cap keepalive request bodies at 64KB, and a base64
      // PDF far exceeds that, causing the request to stall.
      blobToBase64(pdfBlob)
        .then((base64) =>
          fetch(`${api}/upload-pdf`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pdf: base64,
              name: basics.name,
              title: basics.title,
              uuid,
            }),
          })
        )
        .catch(() => {
          // silent — background upload is best-effort
        });
    } catch (error) {
      // show the error message to the user
      toast({
        title: "Error",
        description: `${
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadJson = () => {
    // close the menu
    setIsDialogOpen(false);

    // create a json file
    // TODO: add pdf settings to the json
    const json = JSON.stringify(
      {
        ...resumeData,
        hiddenItemIds,
        pdfSettings: {
          fontFamily,
          fontSize,
          fontCategory,
          lineHeight,
          scale,
          verticalSpacing,
          skillsLayout,
          margin: {
            MIN: margin.MIN,
            MAX: margin.MAX,
            INITIAL: margin.INITIAL,
            VALUE: margin.VALUE,
          },
          pageBreakLine: true,
        },
      },
      null,
      2
    );
    console.log(json);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${basics.name}-${basics.title}.json`;
    link.click();
  };

  return (
    <>
      <Button
        type="button"
        title="Download your CV"
        variant={type === "icon" ? "ghost" : "default"}
        size={type === "icon" ? "icon" : "default"}
        className={cn("rounded-md", className)}
        onClick={() => setIsDialogOpen(true)}
      >
        {isLoading ? (
          <>
            <span className="flex items-center gap-2">
              <LoaderCircle className="animate-spin" />
              Downloading...
            </span>
          </>
        ) : type === "icon" ? (
          <Download />
        ) : (
          <span className="flex items-center gap-2">
            <Download /> Download
          </span>
        )}
      </Button>
      <DownloadOptionsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        downloadPdf={downloadPdf}
        downloadJson={downloadJson}
      />
    </>
  );
};
