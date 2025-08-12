import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../providers/ThemeProvider";
import { cn } from "../../lib/utils";

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
      thumb: "h-4 w-4",
      icon: "h-2.5 w-2.5",
      bgIcon: "h-2.5 w-2.5",
      translate: isVertical
        ? isDark
          ? "translate-y-7"
          : "translate-y-1"
        : isDark
        ? "translate-x-7"
        : "translate-x-1",
      padding: "p-0.5",
    },
    md: {
      container: isVertical ? "h-16 w-8" : "h-8 w-16",
      thumb: "h-6 w-6",
      icon: "h-3.5 w-3.5",
      bgIcon: "h-3.5 w-3.5",
      translate: isVertical
        ? isDark
          ? "translate-y-9"
          : "translate-y-1"
        : isDark
        ? "translate-x-9"
        : "translate-x-1",
      padding: "p-1",
    },
    lg: {
      container: isVertical ? "h-20 w-10" : "h-10 w-20",
      thumb: "h-8 w-8",
      icon: "h-4 w-4",
      bgIcon: "h-4 w-4",
      translate: isVertical
        ? isDark
          ? "translate-y-11"
          : "translate-y-1"
        : isDark
        ? "translate-x-11"
        : "translate-x-1",
      padding: "p-1",
    },
  };

  const config = sizeConfig[size];

  return (
    <button
      onClick={handleThemeChange}
      className={cn(
        "relative inline-flex items-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background shadow-inner border",
        config.container,
        isVertical && "flex-col",
        isDark ? "bg-primary" : "bg-background",
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
                ? "text-secondary scale-90 opacity-60"
                : "text-secondary scale-100 opacity-60"
            )}
          />
          <Moon
            className={cn(
              config.bgIcon,
              "transition-all duration-300",
              isDark
                ? "text-accent-foreground scale-100 opacity-60"
                : "text-accent-foreground scale-90 opacity-40"
            )}
          />
        </div>
      )}

      {/* Sliding thumb */}
      <span
        className={cn(
          "relative z-10 inline-flex items-center justify-center transform rounded-full shadow-lg transition-all duration-300 ease-in-out",
          config.thumb,
          config.translate,
          // Thumb styling
          isDark ? "bg-primary-foreground" : "bg-white"
        )}
      >
        {/* Icon in thumb */}
        {showThumbIcon &&
          (isDark ? (
            <Moon className={cn(config.icon, "text-primary")} />
          ) : (
            <Sun className={cn(config.icon, "text-primary")} />
          ))}
      </span>
    </button>
  );
};
