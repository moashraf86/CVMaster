import React, { lazy, Suspense } from "react";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  GalleryVertical,
  RefreshCcw,
  Text,
  UserRound,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  FileText,
} from "lucide-react";
import { Slider } from "../ui/slider";
import { usePdfSettings, useResume } from "../../store/useResume";
import { PDF_SETTINGS } from "../../lib/constants";
import { Button } from "../ui/button";
import { FontSelectorAccordion } from "./FontSelectorAccordion";
import { loadGoogleFont } from "../../lib/googleFonts";
import { ScrollArea } from "../ui/scroll-area";
import { useWindowSize } from "@uidotdev/usehooks";
interface ControlsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

// Lazy load the DndSections component
const DndSections = lazy(() => import("./DndSections"));

export const ControlsSheet: React.FC<ControlsSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    setData,
    resumeData: { basics },
  } = useResume();
  const {
    setValue,
    pdfSettings: { fontFamily, fontSize, lineHeight, verticalSpacing, margin },
  } = usePdfSettings();
  const windowSize = useWindowSize();
  const isMobile = windowSize.width && windowSize.width < 640;

  const handleFontSizeChange = (value: number) => {
    console.log(value);
    setValue("fontSize", value);
  };

  const handleLineHeightChange = (value: number) => {
    console.log(value);
    setValue("lineHeight", value);
  };

  const handleVerticalSpacingChange = (value: number) => {
    console.log(value);
    setValue("verticalSpacing", value);
  };

  // handle justify content
  const handleJustify = (alignment: "start" | "center" | "end") => {
    setData({
      basics: {
        ...basics,
        alignment,
      },
    });
  };

  // change font type
  const changeFontType = (fontClassName: string) => {
    setValue("fontFamily", fontClassName);
    loadGoogleFont(fontClassName, ["400", "700"]);
  };

  // handle margin change
  const handleMarginChange = (value: number) => {
    setValue("margin", { ...margin, VALUE: value });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={isMobile ? "left" : "right"} className="p-0">
        <ScrollArea className="relative h-full p-6">
          <SheetHeader>
            <SheetTitle>Controls</SheetTitle>
            <SheetDescription>Change the controls of your CV.</SheetDescription>
          </SheetHeader>
          {/* Personal info Layout */}
          <div className="flex flex-col gap-6 mt-8">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserRound className="size-4" />
              Personal info layout
            </h3>
            {/* Justify Content controller */}
            <div className="flex items-center justify-between gap-2 py-1.5 px-3 border border-border rounded-md">
              <Button
                title="Justify start"
                type="button"
                variant={basics.alignment === "start" ? "default" : "ghost"}
                className="rounded-sm"
                onClick={() => handleJustify("start")}
              >
                <AlignStartVertical className="!size-5" />
              </Button>
              <Button
                title="Justify center"
                type="button"
                variant={basics.alignment === "center" ? "default" : "ghost"}
                className="rounded-sm"
                onClick={() => handleJustify("center")}
              >
                <AlignCenterVertical className="!size-5" />
              </Button>
              <Button
                title="Justify end"
                type="button"
                variant={basics.alignment === "end" ? "default" : "ghost"}
                className="rounded-sm"
                onClick={() => handleJustify("end")}
              >
                <AlignEndVertical className="!size-5" />
              </Button>
            </div>
          </div>
          <Separator className="my-8" />
          {/* Layout*/}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GalleryVertical className="size-4" />
              Layout
            </h3>
            <div className="space-y-2">
              <Suspense fallback={<div>Loading...</div>}>
                <DndSections />
              </Suspense>
            </div>
          </div>
          <Separator className="my-8" />
          {/* Typography */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Text className="size-4" />
              Typography
            </h3>
            {/* ISSUE HERE */}
            <div className="flex flex-col gap-2">
              <Label className="h-9 flex items-center">Font family</Label>
              <FontSelectorAccordion
                currentFont={
                  fontFamily.charAt(0).toUpperCase() + fontFamily.slice(1)
                }
                onFontChange={changeFontType}
              />
            </div>
            {/* ISSUE HERE */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Font size</Label>
                <Button
                  title="Reset font size"
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setValue("fontSize", PDF_SETTINGS.FONTSIZE.INITIAL)
                  }
                >
                  <RefreshCcw className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Slider
                  value={[fontSize]}
                  min={PDF_SETTINGS.FONTSIZE.MIN}
                  max={PDF_SETTINGS.FONTSIZE.MAX}
                  step={PDF_SETTINGS.FONTSIZE.STEP}
                  onValueChange={(value) => handleFontSizeChange(value[0])}
                />
                <span className="text-sm font-semibold text-primary">
                  {fontSize}px
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Line height</Label>
                <Button
                  title="Reset line height"
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setValue("lineHeight", PDF_SETTINGS.LINEHEIGHT.INITIAL)
                  }
                >
                  <RefreshCcw className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Slider
                  value={[lineHeight]}
                  min={PDF_SETTINGS.LINEHEIGHT.MIN}
                  max={PDF_SETTINGS.LINEHEIGHT.MAX}
                  step={PDF_SETTINGS.LINEHEIGHT.STEP}
                  onValueChange={(value) => handleLineHeightChange(value[0])}
                />
                <span className="text-sm font-semibold text-primary">
                  {/* convert to rem from tailwind */}
                  {(lineHeight * 4) / 16}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Vertical spacing</Label>
                <Button
                  title="Reset vertical spacing"
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setValue(
                      "verticalSpacing",
                      PDF_SETTINGS.VERTICALSPACING.INITIAL
                    )
                  }
                >
                  <RefreshCcw className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Slider
                  value={[verticalSpacing]}
                  min={PDF_SETTINGS.VERTICALSPACING.MIN}
                  max={PDF_SETTINGS.VERTICALSPACING.MAX}
                  step={PDF_SETTINGS.VERTICALSPACING.STEP}
                  onValueChange={(value) =>
                    handleVerticalSpacingChange(value[0])
                  }
                />
                <span className="text-sm font-semibold text-primary">
                  {/* convert to rem from tailwind */}
                  {(verticalSpacing * 4) / 16}
                </span>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          {/* Margin */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="size-4" />
              Page
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Margin</Label>
                <Button
                  title="Reset margin"
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setValue("margin", {
                      ...margin,
                      VALUE: PDF_SETTINGS.MARGIN.INITIAL,
                    })
                  }
                >
                  <RefreshCcw className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Slider
                  value={[margin.VALUE]}
                  min={PDF_SETTINGS.MARGIN.MIN}
                  max={PDF_SETTINGS.MARGIN.MAX}
                  step={PDF_SETTINGS.MARGIN.STEP}
                  onValueChange={(value) => handleMarginChange(value[0])}
                />
                <span className="text-sm font-semibold text-primary">
                  {margin.VALUE}px
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
