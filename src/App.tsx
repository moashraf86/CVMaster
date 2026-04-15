import { Preview } from "./components/layout/Preview";
import { CvForm } from "./components/layout/CvForm";
import { DialogProvider } from "./providers/DialogProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Toaster } from "./components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { MobileCvTabs } from "./components/layout/MobileCvTabs";
import { useLockBodyScroll, useWindowSize } from "@uidotdev/usehooks";
import { Header } from "./components/layout/Header";
import { useState, useEffect } from "react";
import { AppLoader } from "./components/core/AppLoader";

function App() {
  const windowSize = useWindowSize();
  const isMobile = windowSize.width !== null && windowSize.width < 1024;
  const [isAppReady, setIsAppReady] = useState(false);
  const isFirstVisit = !sessionStorage.getItem("hasVisited");

  useEffect(() => {
    const initializeApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsAppReady(true);

      // Mark as visited after first load
      if (isFirstVisit) {
        sessionStorage.setItem("hasVisited", "true");
      }
    };

    initializeApp();
  }, [isFirstVisit]);

  // lock body scroll
  useLockBodyScroll();

  // Show loader only on first visit while app is initializing
  if (isFirstVisit && !isAppReady) {
    return (
        <AppLoader />
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="cv-master-theme">
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
