import { useEffect } from "react";
import { useFormStore } from "../../store/useFormStore";
import { HeaderForm } from "../core/HeaderForm";
import { SummaryForm } from "../core/SummaryForm";
import { ExperienceForm } from "../core/ExperienceForm";
import { ProjectsForm } from "../core/ProjectsForm";

export const CvForm: React.FC = () => {
  const { step, formData } = useFormStore();

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="w-2/5">
      {step === 0 && <HeaderForm />}
      {step === 1 && <SummaryForm />}
      {step === 2 && <ExperienceForm />}
      {step === 3 && <ProjectsForm />}
    </div>
  );
};
