import { useEffect } from "react";
import { useFormStore } from "../../store/useFormStore";
import { HeaderForm } from "../core/HeaderForm";
import { SummaryForm } from "../core/SummaryForm";

export const CvForm: React.FC = () => {
  const { step, formData } = useFormStore();

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="w-1/3">
      {step === 0 && <HeaderForm />}
      {step === 1 && <SummaryForm />}
    </div>
  );
};
