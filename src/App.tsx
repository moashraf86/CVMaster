import { CvForm } from "./components/layout/CvForm";
import { CvPreview } from "./components/layout/CvPreview";
import { DialogProvider } from "./providers/DialogProvider";

function App() {
  return (
    <DialogProvider>
      <div className="container-fluid">
        <div className="flex gap-10">
          <CvForm />
          <CvPreview />
        </div>
      </div>
    </DialogProvider>
  );
}

export default App;
