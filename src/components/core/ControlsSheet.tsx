import React from "react";
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
} from "lucide-react";
import { Slider } from "../ui/slider";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SectionName } from "../../types/types";
import { usePdfSettings, useResume } from "../../store/useResume";
import { SortableItem } from "./SortableItem";
import { PDF_SETTINGS } from "../../lib/constants";
import { Button } from "../ui/button";
import { FontSelectorAccordion } from "./FontSelectorAccordion";
import { loadGoogleFont } from "../../lib/googleFonts";

interface ControlsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlsSheet: React.FC<ControlsSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    setData,
    sectionOrder,
    setSectionOrder,
    resumeData: { basics },
  } = useResume();
  const {
    setValue,
    pdfSettings: { fontFamily, fontSize, lineHeight, verticalSpacing },
  } = usePdfSettings();

  // Handle drag-and-drop reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as SectionName);
      const newIndex = sectionOrder.indexOf(over.id as SectionName);

      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      setSectionOrder(newOrder);
    }
  };

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sectionOrder}
                strategy={verticalListSortingStrategy}
              >
                {sectionOrder.map((sectionId) => (
                  <SortableItem key={sectionId} id={sectionId}>
                    {sectionId}
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
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
                onValueChange={(value) => handleVerticalSpacingChange(value[0])}
              />
              <span className="text-sm font-semibold text-primary">
                {/* convert to rem from tailwind */}
                {(verticalSpacing * 4) / 16}
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
