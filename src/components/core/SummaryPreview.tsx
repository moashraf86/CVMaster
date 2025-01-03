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
    <section className="mb-4 font-roboto">
      <h3 className="text-lg font-bold border-b border-primary mb-2">
        Summary
      </h3>
      {summary && <p>{summary.content}</p>}
    </section>
  );
};
