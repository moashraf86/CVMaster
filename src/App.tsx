import { Preview } from "./components/layout/Preview";
import { CvForm } from "./components/layout/CvForm";
import { DialogProvider } from "./providers/DialogProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Toaster } from "./components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { MobileCvTabs } from "./components/layout/MobileCvTabs";
import { useLockBodyScroll, useWindowSize } from "@uidotdev/usehooks";
import { Header } from "./components/layout/Header";

function App() {
  const windowSize = useWindowSize();
  const isMobile = windowSize.width !== null && windowSize.width < 1024;

  // lock body scroll
  useLockBodyScroll();
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <DialogProvider>
        <div className="size-full overflow-hidden">
          <Header />
          {isMobile ? (
            <MobileCvTabs />
          ) : (
            <div className="flex flex-col lg:flex-row">
              <CvForm />
              <Preview />
            </div>
          )}
          <Toaster />
        </div>
        <Analytics />
      </DialogProvider>
    </ThemeProvider>
  );
}

export default App;
