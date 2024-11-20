import { CvForm } from "./components/layout/CvForm";
import { Preview } from "./components/preview";
import { DialogProvider } from "./providers/DialogProvider";

function App() {
  return (
    <DialogProvider>
      <div className="container-fluid">
        <div className="flex gap-10">
          <CvForm />
          <Preview mode="preview" />
        </div>
      </div>
    </DialogProvider>
  );
}

export default App;
