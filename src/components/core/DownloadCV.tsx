import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Button } from "../ui/button";
import { Download, LoaderCircle } from "lucide-react";
import { Page } from "../preview";
import { useState } from "react";
import { toast } from "../../hooks/use-toast";
import { Basics } from "../../types/types";
import { useResume } from "../../store/useResume";
import { cn } from "../../lib/utils";
import { DownloadOptionsMenu } from "./DownloadOptionsMenu";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { resumeData } = useResume();
  const { basics } = resumeData;

  // render CVPreview component to HTML
  const getHtmlContent = () => {
    return `<html>
			<head>
				<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
			</head>
			<style>
					/* inter-latin-wght-normal */
					@font-face {
						font-family: "Inter Variable";
						font-style: normal;
						font-display: auto;
						font-weight: 100 900;
						src: url(https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@latest/latin-wght-normal.woff2)
							format("woff2-variations");
						unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
							U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122,
							U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
					}

					/* roboto-slab-latin-wght-normal */
					@font-face {
						font-family: "Roboto Slab Variable";
						font-style: normal;
						font-display: swap;
						font-weight: 100 900;
						src: url(https://cdn.jsdelivr.net/fontsource/fonts/roboto-slab:vf@latest/latin-wght-normal.woff2)
							format("woff2-variations");
						unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
							U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122,
							U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
					}

					/* lora-latin-wght-normal */
					@font-face {
						font-family: "Lora Variable";
						font-style: normal;
						font-display: auto;
						font-weight: 400 700;
						src: url(https://cdn.jsdelivr.net/fontsource/fonts/lora:vf@latest/latin-wght-normal.woff2)
							format("woff2-variations");
						unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
							U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122,
							U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
					}

					/* open-sans-latin-wght-normal */
					@font-face {
						font-family: "Open Sans Variable";
						font-style: normal;
						font-display: auto;
						font-weight: 300 800;
						src: url(https://cdn.jsdelivr.net/fontsource/fonts/open-sans:vf@latest/latin-wght-normal.woff2)
							format("woff2-variations");
						unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
							U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122,
							U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
					}

					/* nunito-latin-wght-normal */
					@font-face {
						font-family: "Nunito Variable";
						font-style: normal;
						font-display: auto;
						font-weight: 200 1000;
						src: url(https://cdn.jsdelivr.net/fontsource/fonts/nunito:vf@latest/latin-wght-normal.woff2)
							format("woff2-variations");
						unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
							U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122,
							U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
					}

					/* playfair-display-latin-wght-normal */
					@font-face {
						font-family: "Playfair Display Variable";
						font-style: normal;
						font-display: auto;
						font-weight: 400 900;
						src: url(https://cdn.jsdelivr.net/fontsource/fonts/playfair-display:vf@latest/latin-wght-normal.woff2)
							format("woff2-variations");
						unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
							U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122,
							U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
					}

					.font-inter {
						font-family:"Inter Variable", sans-serif
					}

					.font-roboto {
						font-family: "Roboto Slab Variable", serif
					}

					.font-lora {
						font-family: "Lora Variable", serif
					}

					.font-open {
						font-family: "Open Sans Variable", sans-serif
					}

					.font-nunito {
						font-family: "Nunito Variable", sans-serif
					}

					.font-playfair {
						font-family : "Playfair Display Variable", serif
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
      setIsMenuOpen(false);

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
    setIsMenuOpen(false);

    // create a json file
    const json = JSON.stringify(resumeData, null, 2);
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
        onClick={() => setIsMenuOpen(true)}
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
      <DownloadOptionsMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        downloadPdf={downloadPdf}
        downloadJson={downloadJson}
      />
    </>
  );
};
