import { ThemeProvider } from "../../providers/ThemeProvider";

export const AppLoader = ({
  message = "Loading CV Master...",
}: {
  message?: string;
}) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="cv-master-theme">
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-primary text-lg font-semibold font-mono">
            {message}
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
};
