import { CheckIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
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
import { usePdfSettings } from "../../store/useResume";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export const FontSelectorAccordion = ({
  currentFont,
  onFontChange,
}: {
  currentFont: string;
  onFontChange: (font: string) => void;
}) => {
  const [googleFonts, setGoogleFonts] = useState<FontInfo[]>([]);
  const fontNames = googleFonts.map((font) => font.family);

  const {
    pdfSettings: { fontFamily, fontCategory },
  } = usePdfSettings();

  const value = currentFont ? currentFont : "Inter";
  const [selectedCategory, setSelectedCategory] = useState<string>(
    fontCategory || FONT_CATEGORIES[0]
  );

  // keep previous font name when changing category
  const previousFont = useRef<string>(fontFamily);

  const handleFontChange = (currentValue: string) => {
    setSelectedCategory(fontCategory);
    onFontChange(currentValue);
  };

  const [ref, entry] = useIntersectionObserver({
    threshold: 0.5,
    root: null,
    rootMargin: "0px",
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      loadGoogleFont(entry?.target?.textContent || fontFamily, ["400", "700"]);
    }
    // clear the ref
    ref(null);
  }, [entry]);

  useEffect(() => {
    // fetch the fonts
    const fetchFonts = async () => {
      const fonts = await fetchGoogleFonts(
        GOOGLE_FONTS_API_KEY,
        selectedCategory
      );
      setGoogleFonts(fonts);
      //set fonts to the ATS Friendly fonts
      if (selectedCategory === "ATS-Friendly")
        setGoogleFonts(ATS_FRIENDLY_FONTS as FontInfo[]);
      else setGoogleFonts(fonts);
    };
    fetchFonts();
  }, [selectedCategory]);

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="item-1"
        className="border border-border shadow-sm rounded-md hover:bg-accent"
      >
        <AccordionTrigger className="items-center px-4 h-10 hover:no-underline">
          <span
            className="leading-normal font-bold"
            style={{
              fontFamily: value.toLowerCase(),
            }}
          >
            {value
              ? fontNames.find((font) => font === value) || previousFont.current
              : "Select font..."}
          </span>
        </AccordionTrigger>
        <AccordionContent className="p-0">
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
