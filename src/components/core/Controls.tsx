import {
  AArrowDown,
  AArrowUp,
  History,
  SquareSquare,
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

export const Controls: React.FC = () => {
  const { zoomIn, zoomOut, resetTransform, instance } = useControls();

  const {
    setValue,
    pdfSettings: { fontSize, fontFamily, scale: pdfScale },
  } = usePdfSettings();

  // handle zoom in
  const handleZoomIn = () => {
    zoomIn(0.25);
    setValue("scale", Math.min(pdfScale + 0.25, 2));
  };

  // handle zoom out
  const handleZoomOut = () => {
    zoomOut(0.25);
    setValue("scale", Math.max(pdfScale - 0.2, 0.5));
  };

  // reset transform
  const resetZoom = () => {
    resetTransform();
    instance.setCenter();
    setValue("scale", 1);
  };

  // set center
  const setCenter = () => {
    instance.setCenter();
  };
  // increase font size
  const increaseFontSize = () => {
    setValue("fontSize", Math.min(fontSize + 1, 18));
  };

  // decrease font size
  const decreaseFontSize = () => {
    setValue("fontSize", Math.max(fontSize - 1, 12));
  };

  // reset font size
  const resetFontSize = () => {
    setValue("fontSize", 14);
  };

  // change font type
  const changeFontType = (value: string) => {
    setValue("fontFamily", value);
  };

  return (
    <div className="flex absolute z-50 bottom-4 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-full shadow-xl px-1.5 py-2">
      <div className="flex border-r px-1">
        <Button
          title="Zoom In"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleZoomIn}
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
      <div className="flex border-r px-1">
        <Button
          title="Increase Font Size"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={increaseFontSize}
          disabled={fontSize === 18}
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
          disabled={fontSize === 12}
        >
          <AArrowDown />
        </Button>
        <Button
          title="Reset Font Size"
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={resetFontSize}
          disabled={fontSize === 14}
        >
          <History />
        </Button>
      </div>
      <div className="flex border-r px-1">
        <Select defaultValue={fontFamily} onValueChange={changeFontType}>
          <Button
            asChild
            type="button"
            variant="ghost"
            className="focus:ring-0"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
          </Button>
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
      </div>
      <div className="flex px-1">
        <DownloadPDF />
      </div>
      <div className="fonts" hidden>
        <div className="font-lora"></div>
        <div className="font-inter"></div>
        <div className="font-roboto"></div>
        <div className="font-open"></div>
        <div className="font-nunito"></div>
        <div className="font-playfair"></div>
      </div>
    </div>
  );
};
