"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FontInfo } from "../../types/types";
import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { fetchGoogleFonts, loadGoogleFont } from "../../lib/googleFonts";
import {
  ATS_FRIENDLY_FONTS,
  GOOGLE_FONTS_API_KEY,
  FONT_CATEGORIES,
} from "../../lib/constants";
import { FontsCategorySelect } from "./FontsCategorySelect";
import { Separator } from "../ui/separator";

export const FontSelect = ({
  currentFont,
  defaultFont,
  onFontChange,
}: {
  currentFont: string;
  defaultFont: string;
  onFontChange: (font: string) => void;
}) => {
  const [googleFonts, setGoogleFonts] = useState<FontInfo[]>([]);
  const fontNames = googleFonts.map((font) => font.family);

  const value = currentFont ? currentFont : "Inter";
  const [fontOpen, setFontOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    FONT_CATEGORIES[0] || "sans-serif"
  );
  // keep previous font name when changing category
  const previousFont = useRef<string>(defaultFont);

  const handleFontChange = (currentValue: string) => {
    setFontOpen(false);
    onFontChange(currentValue);
  };

  const [ref, entry] = useIntersectionObserver({
    threshold: 0.5,
    root: null,
    rootMargin: "0px",
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      loadGoogleFont(entry?.target?.textContent || defaultFont, ["400", "700"]);
    }
    // clear the ref
    ref(null);
  }, [entry]);

  useEffect(() => {
    // load the initial font
    loadGoogleFont(defaultFont || "Inter", ["400", "700"]);

    // fetch the fonts
    const fetchFonts = async () => {
      const fonts = await fetchGoogleFonts(
        GOOGLE_FONTS_API_KEY,
        selectedCategory
      );
      setGoogleFonts(fonts);
      //set fonts to the ATS friendly fonts
      if (selectedCategory === "ATS Friendly")
        setGoogleFonts(ATS_FRIENDLY_FONTS as FontInfo[]);
      else setGoogleFonts(fonts);
    };
    fetchFonts();
  }, [selectedCategory]);

  return (
    <Popover open={fontOpen} onOpenChange={setFontOpen}>
      <PopoverTrigger asChild>
        <Button
          title="Select font"
          variant="outline"
          role="combobox"
          aria-expanded={fontOpen}
          className="w-auto justify-between"
        >
          <span
            style={{
              fontFamily: value.toLowerCase(),
            }}
          >
            {value
              ? fontNames.find((font) => font === value) || previousFont.current
              : "Select font..."}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] min-h-[280px] p-0">
        <FontsCategorySelect
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <Separator />
        <Command value={value}>
          <CommandInput placeholder="Search font..." />
          <CommandList className="pt-2">
            <CommandEmpty>No fonts found.</CommandEmpty>
            <CommandGroup>
              {googleFonts.map((font) => (
                <CommandItem
                  ref={ref}
                  key={font.family}
                  value={font.family}
                  onSelect={handleFontChange}
                  className={cn(
                    "cursor-pointer",
                    value === font.family
                      ? "bg-accent text-accent-foreground"
                      : ""
                  )}
                >
                  <span
                    className="mr-2"
                    style={{
                      fontFamily: font.family.toLowerCase(),
                    }}
                  >
                    {font.family}
                  </span>
                  <CheckIcon
                    className={cn(
                      "ms-auto h-4 w-4",
                      value === font.family ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
