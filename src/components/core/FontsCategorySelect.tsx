import { useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { FONT_CATEGORIES } from "../../lib/constants";
import { usePdfSettings } from "../../store/useResume";

export const FontsCategorySelect = ({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const { setValue } = usePdfSettings();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerWidth = triggerRef.current?.offsetWidth;
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setOpen(false);
    setValue("fontCategory", category);
  };

  return (
    <div className="flex w-full">
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild ref={triggerRef}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between m-2 bg-accent"
          >
            <span className="capitalize">
              {selectedCategory
                ? `${selectedCategory} fonts`
                : "Select font category"}
            </span>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" style={{ width: triggerWidth }}>
          <Command>
            <CommandGroup>
              {FONT_CATEGORIES.map((category) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={handleCategoryChange}
                  className={cn(
                    "cursor-pointer font-medium",
                    selectedCategory === category
                      ? "bg-accent text-accent-foreground"
                      : ""
                  )}
                >
                  <span className="capitalize">{category} fonts</span>
                  <CheckIcon
                    className={cn(
                      "ms-auto h-4 w-4",
                      selectedCategory === category
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
