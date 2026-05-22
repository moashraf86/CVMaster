import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Button } from "../ui/button";
import { Download, LoaderCircle } from "lucide-react";
import { Page } from "../preview";
import { useEffect, useState } from "react";
import { toast } from "../../hooks/use-toast";
import { Basics } from "../../types/types";
import { usePdfSettings, useResume } from "../../store/useResume";
import { cn } from "../../lib/utils";
import { DownloadOptionsDialog } from "./dialogs/DownloadOptionsDialog";
import { buildFontCssUrl } from "../../lib/googleFonts";

const TAILWIND_CDN =
  "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

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
      margin,
      skillsLayout,
    },
  } = usePdfSettings();
  const { basics } = resumeData;

  useEffect(() => {
    const links: HTMLLinkElement[] = [];

    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = "https://cdn.jsdelivr.net";
    preconnect.crossOrigin = "anonymous";
    document.head.appendChild(preconnect);
    links.push(preconnect);

    const prefetch = document.createElement("link");
    prefetch.rel = "prefetch";
    prefetch.as = "style";
    prefetch.href = TAILWIND_CDN;
    document.head.appendChild(prefetch);
    links.push(prefetch);

    return () => {
      links.forEach((link) => link.remove());
    };
  }, []);

  // render CVPreview component to HTML
  const getHtmlContent = () => {
    const fontCssUrl = buildFontCssUrl(fontFamily, ["400", "700"]);

    return `<html>
			<head>
				<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
				<link rel="preconnect" href="https://fonts.googleapis.com">
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
				<link rel="preload" href="${TAILWIND_CDN}" as="style">
				<link rel="preload" href="${fontCssUrl}" as="style">
				<link href="${TAILWIND_CDN}" rel="stylesheet">
				<link href="${fontCssUrl}" rel="stylesheet">
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
			</head>
			<body>
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
          margin,
          uploadToCloudinary: true,
        }),
      });

      // check if the response is ok
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to generate PDF.");
      }

      const contentType = res.headers.get("content-type") || "";
      const downloadName = `${basics.name}-${basics.title}.pdf`;

      if (!contentType.includes("application/pdf")) {
        const data = await res.json();
        if (!data.url) {
          throw new Error("Invalid response from server. Please try again.");
        }

        const link = document.createElement("a");
        link.href = data.url;
        link.target = "_blank";
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const blob = await res.blob();
      if (blob.size < 100) {
        throw new Error("Generated PDF is empty. Please try again.");
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
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
