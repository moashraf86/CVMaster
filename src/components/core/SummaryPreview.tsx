import { useFormStore } from "../../store/useFormStore";

export const SummaryPreview: React.FC = () => {
  const { formData } = useFormStore();
  const { summary } = formData;

  return (
    <section className="mb-4 font-roboto">
      <h3 className="text-lg font-bold border-b border-primary mb-2">
        Summary
      </h3>
      {summary && <p>{summary}</p>}
    </section>
  );
};
