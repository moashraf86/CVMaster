import { useEffect } from "react";
import { useFormStore } from "../../store/useFormStore";

export const SummaryPreview: React.FC = () => {
  const { formData } = useFormStore();
  const { summary } = formData;

  useEffect(() => {
    console.log(summary);
  });
  return (
    <section className="mb-4 font-roboto">
      <h3 className="text-[12px] font-normal border-b border-primary mb-2">
        Summary
      </h3>
      {summary && <p>{summary}</p>}
    </section>
  );
};
