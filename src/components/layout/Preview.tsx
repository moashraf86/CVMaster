import {
  ReactZoomPanPinchRef,
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";
import { Page } from "../preview";
import { Controls } from "../core/Controls";
import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { useGestureZoomHandler } from "../../hooks/useGestureZoomHandler";
import { PDF_SETTINGS } from "../../lib/constants";
import { usePdfSettings } from "../../store/useResume";
import { loadGoogleFont } from "../../lib/googleFonts";

export const Preview: React.FC = () => {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [wheelPanning, setWheelPanning] = useState(false);
  const handleGestureZoom = useGestureZoomHandler();
  const windowSize = useWindowSize();
  const isMobile = windowSize.width && windowSize.width < 640;

  const {
    setValue,
    pdfSettings: { scale: initialScale, fontFamily, margin },
  } = usePdfSettings();

  useEffect(() => {
    const width = windowSize.width;
    if (!transformRef.current || width === null) return;

    let newScale = PDF_SETTINGS.SCALE.INITIAL;

    if (width < 430) {
      newScale = PDF_SETTINGS.SCALE.SMALL;
    } else if (width < 640) {
      newScale = PDF_SETTINGS.SCALE.MEDIUM;
      setWheelPanning(true);
    } else if (width >= 1280) {
      newScale = PDF_SETTINGS.SCALE.LARGE;
    }

    //only update if changed
    if (newScale !== initialScale) {
      setValue("scale", newScale);

      //center the view and set the scale to the new scale
      transformRef.current.centerView(newScale, 0);
    }
  }, [windowSize.width]);

  useEffect(() => {
    loadGoogleFont(fontFamily || "Inter", ["400", "700"]);
  }, [fontFamily]);

  return (
    <TransformWrapper
      ref={transformRef}
      centerZoomedOut={true}
      centerOnInit={true}
      initialScale={initialScale || PDF_SETTINGS.SCALE.INITIAL}
      minScale={PDF_SETTINGS.SCALE.MIN}
      maxScale={PDF_SETTINGS.SCALE.MAX}
      limitToBounds={false}
      onZoom={handleGestureZoom}
      onZoomStop={handleGestureZoom}
      smooth={true}
      wheel={{
        wheelDisabled: wheelPanning,
      }}
      panning={{ wheelPanning: wheelPanning }}
    >
      <>
        <TransformComponent
          wrapperClass="relative !w-screen !h-[calc(100vh-104px)] lg:!h-[calc(100vh-64px)] flex-auto grow shrink-0 basis-[60%] 2xl:basis-[65%] xl:!w-auto"
          contentClass="items-start justify-center pointer-events-none"
          contentStyle={{ width: "100%", transition: "transform 0.1s" }}
        >
          <div
            className="bg-white shadow-2xl"
            style={{
              padding: `${margin.VALUE}px`,
            }}
          >
            <Page mode="preview" />
          </div>
        </TransformComponent>
        {!isMobile && (
          <div className="flex justify-center items-center absolute z-20 lg:z-50 left-1/2 right-auto -translate-x-1/2 top-auto bottom-4 transform px-3">
            <Controls
              elem={transformRef}
              wheelPanning={wheelPanning}
              setWheelPanning={setWheelPanning}
            />
          </div>
        )}
      </>
    </TransformWrapper>
  );
};
