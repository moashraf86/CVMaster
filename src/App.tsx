import { CvForm } from "./components/layout/CvForm";
import { CvPreview } from "./components/layout/CvPreview";
import { FormProvider } from "./store/useFormContext";

function App() {
  return (
    <div className="container-fluid flex gap-10 p-10">
      <CvForm />
      <CvPreview />
    </div>
  );
}

export default App;
