import {
  History,
  Move,
  Search,
  SlidersVertical,
  SquareSplitVertical,
  SquareSquare,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "../ui/button";
import { ReactZoomPanPinchRef, useControls } from "react-zoom-pan-pinch";
import { usePdfSettings } from "../../store/useResume";
import { useState } from "react";
import { PDF_SETTINGS } from "../../lib/constants";
import { ControlsSheet } from "./ControlsSheet";
import { useWindowSize } from "@uidotdev/usehooks";

interface ControlsProps {
  elem: React.RefObject<ReactZoomPanPinchRef>;
  wheelPanning: boolean;
  setWheelPanning: (wheelPanning: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  elem,
  wheelPanning,
  setWheelPanning,
}: ControlsProps) => {
  const { zoomIn, zoomOut, resetTransform, instance } = useControls();

  const {
    setValue,
    pdfSettings: { scale: pdfScale, pageBreakLine },
  } = usePdfSettings();

  const [isControlsOpen, setIsControlsOpen] = useState(false);

  const windowSize = useWindowSize();
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
    let targetScale = PDF_SETTINGS.SCALE.INITIAL;

    // determine target scale based on window size
    if (windowSize.width && windowSize.width < 430) {
      targetScale = PDF_SETTINGS.SCALE.SMALL;
    } else if (windowSize.width && windowSize.width < 640) {
      targetScale = PDF_SETTINGS.SCALE.MEDIUM;
    } else if (windowSize.width && windowSize.width < 1280) {
      targetScale = PDF_SETTINGS.SCALE.INITIAL;
    } else if (windowSize.width && windowSize.width > 1280) {
      targetScale = PDF_SETTINGS.SCALE.LARGE;
    }

    setValue("scale", targetScale);
    resetTransform();

    // Force re-center with the correct target scale
    setTimeout(() => {
      elem?.current?.centerView(targetScale);
    }, 0);
  };

  // Helper function to get target scale based on window size
  const getTargetScale = () => {
    if (windowSize.width && windowSize.width < 430) {
      return PDF_SETTINGS.SCALE.SMALL;
    } else if (windowSize.width && windowSize.width < 640) {
      return PDF_SETTINGS.SCALE.MEDIUM;
    } else if (windowSize.width && windowSize.width < 1280) {
      return PDF_SETTINGS.SCALE.INITIAL;
    } else if (windowSize.width && windowSize.width > 1280) {
      return PDF_SETTINGS.SCALE.LARGE;
    }
    return PDF_SETTINGS.SCALE.INITIAL;
  };
  // set center
  const setCenter = () => {
    instance.setCenter();
  };

  return (
    <div className="flex shadow-none bg-card border border-border rounded-none sm:rounded-full sm:shadow-xl px-1.5 py-2 max-w-full w-full sm:w-auto flex-nowrap overflow-x-auto">
      {/* Zoom controls */}
      <div className="flex border-r px-.5 sm:px-1">
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
          disabled={pdfScale === getTargetScale()}
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
        <Button
          title={wheelPanning ? "scroll to pan" : "scroll to zoom"}
          type="button"
          variant="ghost"
          size="icon"
          className="flex rounded-full"
          onClick={() => setWheelPanning(!wheelPanning)}
        >
          {wheelPanning ? <Move /> : <Search />}
        </Button>
        <Button
          title={
            pageBreakLine ? "Hide Page Break Line" : "Show Page Break Line"
          }
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setValue("pageBreakLine", !pageBreakLine)}
        >
          <SquareSplitVertical className="size-4" />
        </Button>
      </div>

      <div className="flex items-center px-1 gap-1">
        <Button
          title="Controls"
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setIsControlsOpen(true)}
        >
          <SlidersVertical className="size-4" />
        </Button>
      </div>
      <ControlsSheet
        isOpen={isControlsOpen}
        onClose={() => setIsControlsOpen(false)}
      />
    </div>
  );
};
