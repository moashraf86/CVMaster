import { ReviewResult } from "../components/core/ReviewResult";
import { Header } from "../components/layout/Header";
import { ThemeProvider } from "../providers/ThemeProvider";

export const ReviewPage: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="size-full overflow-hidden">
        <Header />
        <ReviewResult />
      </div>
    </ThemeProvider>
  );
};
