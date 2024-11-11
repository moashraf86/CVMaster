import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { HeaderPreview } from "../core/HeaderPreview";
import { SummaryPreview } from "../core/SummaryPreview";
import { ExperiencePreview } from "../core/ExperiencePreview";
import { ProjectsPreview } from "../core/ProjectsPreview";
import { SKillsPreview } from "../core/SkillsPreview";
import { Button } from "../ui/button";

const div = document.createElement("div");
const root = createRoot(div);
flushSync(() => {
  root.render(
    <>
      <HeaderPreview />
      <SummaryPreview />
      <ExperiencePreview />
      <ProjectsPreview />
      <SKillsPreview />
    </>
  );
});
console.log(div.innerHTML);

export const DownloadBtn: React.FC = () => {
  const downloadPdf = async () => {
    // render CVPreview component to HTML
    const htmlContent = `<html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
		<style>
			@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap');
			body {
				font-family: 'Space Grotesk', sans-serif
				}
		</style>
    <body class="p-6">
			<!-- Add other dynamic sections here with Tailwind classes -->
			${div.innerHTML}
    </body>
  </html>`;

    const res = await fetch("http://localhost:5000/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ htmlContent }),
    });

    const data = await res.json();
    const asset_id = data.resource.asset_id;
    const download_link = `https://res-console.cloudinary.com/daswys0i8/media_explorer_thumbnails/${asset_id}/download`;

    // create a link element
    const link = document.createElement("a");
    link.href = download_link;
    link.target = "_blank";
    link.download = "cv.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Button variant="default" onClick={downloadPdf}>
      Download
    </Button>
  );
};
