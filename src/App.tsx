import { Preview } from "./components/layout/Preview";
import { CvForm } from "./components/layout/CvForm";
import { DialogProvider } from "./providers/DialogProvider";

function App() {
  return (
    <DialogProvider>
      <div className="size-full overflow-hidden">
        <div className="flex gap-10">
          <CvForm />
          <Preview />
        </div>
      </div>
    </DialogProvider>
  );
}

export default App;
