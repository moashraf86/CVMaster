import { useFormStore } from "../../store/useFormStore";
import { Button } from "../ui/button";

export const FormNavigation: React.FC = () => {
  const { step, prevStep, nextStep } = useFormStore();

  return (
    <div className="flex justify-between mt-auto">
      <Button variant="outline" onClick={prevStep} disabled={step === 0}>
        Previous
      </Button>
      <Button type="submit" variant="default" disabled={step === 4}>
        Save & Next
      </Button>
    </div>
  );
};
