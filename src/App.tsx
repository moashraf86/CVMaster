import { Preview } from "./components/layout/Preview";
import { CvForm } from "./components/layout/CvForm";
import { DialogProvider } from "./providers/DialogProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <DialogProvider>
        <div className="size-full overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <CvForm />
            <Preview />
            <Toaster />
          </div>
        </div>
      </DialogProvider>
    </ThemeProvider>
  );
}

export default App;
