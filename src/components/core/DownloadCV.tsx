import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Button } from "../ui/button";
import { Download, LoaderCircle } from "lucide-react";
import { Page } from "../preview";
import { useState } from "react";
import { toast } from "../../hooks/use-toast";
import { Basics } from "../../types/types";
import { usePdfSettings, useResume } from "../../store/useResume";
import { cn } from "../../lib/utils";
import { DownloadOptionsDialog } from "./dialogs/DownloadOptionsDialog";
import { buildFontCssUrl } from "../../lib/googleFonts";

const div = document.createElement("div");
const root = createRoot(div);
flushSync(() => {
  root.render(
    <>
      <Page mode="print" />
    </>
  );
});

interface DownloadCVProps {
  className?: string;
  type?: "icon" | "button";
}

export const DownloadCV: React.FC<DownloadCVProps> = ({ className, type }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { resumeData } = useResume();
  const {
    pdfSettings: {
      fontFamily,
      fontSize,
      fontCategory,
      lineHeight,
      scale,
      verticalSpacing,
    },
  } = usePdfSettings();
  const { basics } = resumeData;

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
				${div.innerHTML}
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

      // send the html content to the server
      const api = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${api}/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent,
          name: basics.name,
          title: basics.title,
        }),
      });

      // check if the response is ok
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to generate PDF.");
      }

      // get the data from the server
      const data = await res.json();
      if (!data.url) {
        throw new Error("Invalid response from server. Please try again.");
      }

      // Create a link element and trigger the download
      const link = document.createElement("a");
      link.href = data.url;
      link.target = "_blank";
      link.download = `${basics.name}-${basics.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
        pdfSettings: {
          fontFamily,
          fontSize,
          fontCategory,
          lineHeight,
          scale,
          verticalSpacing,
        },
      },
      null,
      2
    );
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
              Downloading...
              <LoaderCircle className="animate-spin" />
            </span>
          </>
        ) : type === "icon" ? (
          <Download />
        ) : (
          <span className="flex items-center gap-2">
            Download <Download />
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
