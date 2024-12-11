import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "../../providers/ThemeProvider";

export const ThemeToggler: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full"
    >
      <Sun className="rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-transform duration-300" />
      <Moon className="absolute rotate-0 scale-100 dark:rotate-90 dark:scale-0 transition-transform duration-300" />
    </Button>
  );
};
