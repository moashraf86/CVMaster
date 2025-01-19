import { usePdfSettings, useResume } from "../../store/useResume";

export const SummaryPreview: React.FC = () => {
  const {
    resumeData: { summary },
  } = useResume();
  const {
    pdfSettings: { lineHeight },
  } = usePdfSettings();

  // convert summary from html to text
  const summaryContent = summary.content.replace(/<[^>]*>?/gm, "");

  // IF there is no summary, return null
  if (!summary || summaryContent.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-lg font-bold border-b border-primary dark:border-primary-foreground mb-1">
        {summary.sectionTitle}
      </h3>
      <div
        className={`leading-${lineHeight}`}
        dangerouslySetInnerHTML={{ __html: summary.content }}
      />
    </section>
  );
};
