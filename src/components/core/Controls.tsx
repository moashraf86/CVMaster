import {
  AArrowDown,
  AArrowUp,
  FoldVertical,
  GalleryVertical,
  History,
  SquareSquare,
  UnfoldVertical,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "../ui/button";
import { useControls } from "react-zoom-pan-pinch";
import { usePdfSettings } from "../../store/useResume";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DownloadPDF } from "./DownloadPdf";
import { useState } from "react";
import { DragAndDropMenu } from "./DragAndDropMenu";

const PDF_SETTINGS = {
  SCALE: {
    MIN: 0.5,
    MAX: 2,
    STEP: 0.25,
    INITIAL: 0.75,
  },
  FONTSIZE: {
    MIN: 10,
    MAX: 18,
    INITIAL: 14,
    STEP: 1,
  },
  LINEHEIGHT: {
    MIN: 3,
    MAX: 10,
    INITIAL: 6,
    STEP: 1,
  },
};

export const Controls: React.FC = () => {
  const { zoomIn, zoomOut, resetTransform, instance } = useControls();

  const {
    setValue,
    pdfSettings: { fontSize, fontFamily, scale: pdfScale, lineHeight },
  } = usePdfSettings();

  // state for the drag-and-drop menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // handle zoom in
  const handleZoomIn = () => {
    zoomIn(PDF_SETTINGS.SCALE.STEP);
    setValue(
      "scale",
      Math.min(pdfScale + PDF_SETTINGS.SCALE.STEP, PDF_SETTINGS.SCALE.MAX)
    );
  };

  // handle zoom out
  const handleZoomOut = () => {
    zoomOut(PDF_SETTINGS.SCALE.STEP);
    setValue(
      "scale",
      Math.max(pdfScale - PDF_SETTINGS.SCALE.STEP, PDF_SETTINGS.SCALE.MIN)
    );
  };

  // reset transform
  const resetZoom = () => {
    resetTransform();
    setValue("scale", PDF_SETTINGS.SCALE.INITIAL);
  };

  // set center
  const setCenter = () => {
    instance.setCenter();
  };

  // increase font size
  const increaseFontSize = () => {
    setValue(
      "fontSize",
      Math.min(fontSize + PDF_SETTINGS.FONTSIZE.STEP, PDF_SETTINGS.FONTSIZE.MAX)
    );
  };

  // decrease font size
  const decreaseFontSize = () => {
    setValue(
      "fontSize",
      Math.max(fontSize - PDF_SETTINGS.FONTSIZE.STEP, PDF_SETTINGS.FONTSIZE.MIN)
    );
  };

  // reset font size
  const resetFontSize = () => {
    setValue("fontSize", PDF_SETTINGS.FONTSIZE.INITIAL);
  };

  // increase line height
  const increaseLineHeight = () => {
    setValue(
      "lineHeight",
      Math.min(
        lineHeight + PDF_SETTINGS.LINEHEIGHT.STEP,
        PDF_SETTINGS.LINEHEIGHT.MAX
      )
    );
  };

  // decrease line height
  const decreaseLineHeight = () => {
    setValue(
      "lineHeight",
      Math.max(
        lineHeight - PDF_SETTINGS.LINEHEIGHT.STEP,
        PDF_SETTINGS.LINEHEIGHT.MIN
      )
    );
  };

  // reset line height
  const resetLineHeight = () => {
    setValue("lineHeight", PDF_SETTINGS.LINEHEIGHT.INITIAL);
  };

  // change font type
  const changeFontType = (value: string) => {
    setValue("fontFamily", value);
  };

  return (
    <div className="flex bg-card border border-border rounded-full shadow-xl px-1.5 py-2 max-w-full">
      <div className="hidden md:flex border-r px-.5 sm:px-1">
        <Button
          title="Zoom In"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleZoomIn}
          disabled={pdfScale === PDF_SETTINGS.SCALE.MAX}
        >
          <ZoomIn />
        </Button>
        <Button
          title="Zoom Out"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleZoomOut}
          disabled={pdfScale === PDF_SETTINGS.SCALE.MIN}
        >
          <ZoomOut />
        </Button>
        <Button
          title="Reset Zoom"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={resetZoom}
          disabled={pdfScale === PDF_SETTINGS.SCALE.INITIAL}
        >
          <History />
        </Button>
        <Button
          title="Center View"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={setCenter}
        >
          <SquareSquare />
        </Button>
      </div>
      <div className="flex border-r px-.5 sm:px-1">
        <Button
          title="Increase Font Size"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={increaseFontSize}
          disabled={fontSize === PDF_SETTINGS.FONTSIZE.MAX}
        >
          <AArrowUp />
        </Button>
        <Button
          title="Decrease Font Size"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={decreaseFontSize}
          disabled={fontSize === PDF_SETTINGS.FONTSIZE.MIN}
        >
          <AArrowDown />
        </Button>
        <Button
          title="Reset Font Size"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full hidden md:flex"
          onClick={resetFontSize}
          disabled={fontSize === PDF_SETTINGS.FONTSIZE.INITIAL}
        >
          <History />
        </Button>
      </div>
      <div className="flex border-r px-.5 sm:px-1">
        <Button
          title="Increase Line Height"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={increaseLineHeight}
          disabled={lineHeight === PDF_SETTINGS.LINEHEIGHT.MAX}
        >
          <UnfoldVertical />
        </Button>
        <Button
          title="Decrease Line Height"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={decreaseLineHeight}
          disabled={lineHeight === PDF_SETTINGS.LINEHEIGHT.MIN}
        >
          <FoldVertical />
        </Button>
        <Button
          title="Reset Line Height"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full hidden md:flex"
          onClick={resetLineHeight}
          disabled={lineHeight === PDF_SETTINGS.LINEHEIGHT.INITIAL}
        >
          <History />
        </Button>
      </div>
      <div className="flex px-1 sm:gap-1">
        <Select defaultValue={fontFamily} onValueChange={changeFontType}>
          <SelectTrigger className="rounded-full w-auto gap-2">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fonts</SelectLabel>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
              <SelectItem value="lora">Lora</SelectItem>
              <SelectItem value="open">Open Sans</SelectItem>
              <SelectItem value="nunito">Nunito</SelectItem>
              <SelectItem value="playfair">Playfair</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          title="Center View"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full md:hidden"
          onClick={setCenter}
        >
          <SquareSquare />
        </Button>
        <Button
          title="Reorder Sections"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full flex-1"
          onClick={() => setIsMenuOpen(true)}
        >
          <GalleryVertical className="w-4 h-4" />
        </Button>
        <DownloadPDF className="rounded-full hidden md:inline-flex" />
      </div>
      <DragAndDropMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
      <div className="fonts" hidden>
        <div className="font-lora leading-3"></div>
        <div className="font-inter leading-4"></div>
        <div className="font-roboto leading-5"></div>
        <div className="font-open leading-6"></div>
        <div className="font-nunito leading-7"></div>
        <div className="font-playfair leading-8"></div>
        <div className="font-inter leading-9"></div>
        <div className="font-inter leading-10"></div>
      </div>
    </div>
  );
};
