import { CvForm } from "./components/layout/CvForm";
import { CvPreview } from "./components/layout/CvPreview";

function App() {
  return (
    <div className="container-fluid p-10">
      <div className="flex gap-10">
        <CvForm />
        <CvPreview />
      </div>
    </div>
  );
}

export default App;
