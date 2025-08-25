import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../providers/ThemeProvider";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

interface ThemeTogglerProps {
  direction?: "horizontal" | "vertical";
  variant?: "background" | "thumb" | "both";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ThemeToggler: React.FC<ThemeTogglerProps> = ({
  direction = "horizontal",
  variant = "both",
  size = "md",
  className,
}) => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";
  const isVertical = direction === "vertical";
  const showBackground = variant === "background" || variant === "both";
  const showThumbIcon = variant === "thumb" || variant === "both";

  const handleThemeChange = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const sizeConfig = {
    sm: {
      container: isVertical ? "h-12 w-6" : "h-6 w-12",
      thumb: "size-4",
      icon: "!size-2.5",
      bgIcon: "!size-2.5",
      translate: isVertical
        ? isDark
          ? "top-0 translate-y-7"
          : "top-0 translate-y-1"
        : isDark
        ? "left-0 translate-x-7"
        : "left-0 translate-x-1",
      padding: "p-0",
    },
    md: {
      container: isVertical ? "h-16 w-8" : "h-8 w-16",
      thumb: "size-6",
      icon: "!size-3",
      bgIcon: "!size-3",
      translate: isVertical
        ? isDark
          ? "top-0 translate-y-8"
          : "top-0 translate-y-1"
        : isDark
        ? "left-0 translate-x-8"
        : "left-0 translate-x-1",
      padding: "p-0",
    },
    lg: {
      container: isVertical ? "h-20 w-10" : "h-10 w-20",
      thumb: "size-8",
      icon: "!size-4",
      bgIcon: "!size-4",
      translate: isVertical
        ? isDark
          ? "top-0 translate-y-10"
          : "top-0 translate-y-1"
        : isDark
        ? "left-0 translate-x-10"
        : "left-0 translate-x-1",
      padding: "p-0",
    },
  };

  const config = sizeConfig[size];

  return (
    <Button
      onClick={handleThemeChange}
      variant="ghost"
      className={cn(
        "relative inline-flex items-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background shadow-inner border bg-background dark:bg-primary",
        config.container,
        isVertical && "flex-col",
        config.padding,
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Background Icons */}
      {showBackground && (
        <div
          className={cn(
            "absolute inset-0 flex items-center",
            isVertical
              ? "flex-col justify-between py-1.5"
              : "justify-between px-1.5"
          )}
        >
          <Sun
            className={cn(
              config.bgIcon,
              "transition-all duration-300",
              isDark
                ? "text-secondary scale-90 opacity-60 rotate-0"
                : "text-secondary scale-0 opacity-0 -rotate-90"
            )}
          />
          <Moon
            className={cn(
              config.bgIcon,
              "transition-all duration-300",
              isDark
                ? "text-accent-foreground scale-0 opacity-0 -rotate-90"
                : "text-accent-foreground scale-90 opacity-40 rotate-0"
            )}
          />
        </div>
      )}

      {/* Sliding thumb */}
      <span
        className={cn(
          "absolute z-10 inline-flex items-center justify-center transform rounded-full shadow-lg transition-all duration-300 ease-in-out bg-background dark:bg-primary-foreground",
          config.thumb,
          config.translate
        )}
      >
        {/* Icon in thumb */}
        {showThumbIcon && (
          <>
            <Moon
              className={cn(
                config.icon,
                "text-primary scale-0 hidden dark:block dark:scale-100 transition-all duration-300 ease-in-out"
              )}
            />
            <Sun
              className={cn(
                config.icon,
                "text-primary scale-100 dark:hidden dark:scale-0 transition-all duration-300 ease-in-out"
              )}
            />
          </>
        )}
      </span>
    </Button>
  );
};
