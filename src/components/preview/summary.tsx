import { useResume } from "../../store/useResume";

export const SummaryPreview: React.FC = () => {
  const {
    resumeData: { summary },
  } = useResume();

  // IF there is no summary, return null
  if (!summary || !summary.content) {
    return null;
  }

  return (
    <section>
      <h3 className="text-lg font-bold border-b border-primary dark:border-primary-foreground mb-2">
        Summary
      </h3>
      <div dangerouslySetInnerHTML={{ __html: summary.content }} />
    </section>
  );
};
