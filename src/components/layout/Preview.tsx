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

export const Preview: React.FC = () => {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [wheelPanning, setWheelPanning] = useState(false);
  const handleGestureZoom = useGestureZoomHandler();
  const windowSize = useWindowSize();
  const {
    setValue,
    pdfSettings: { scale: initialScale },
  } = usePdfSettings();

  useEffect(() => {
    const width = windowSize.width;

    if (!transformRef.current || width === null) return;

    let scale = initialScale || PDF_SETTINGS.SCALE.INITIAL; // default

    if (width < 430) {
      scale = PDF_SETTINGS.SCALE.SMALL;
      setValue("scale", scale);
    } else if (width < 1024) {
      scale = PDF_SETTINGS.SCALE.MEDIUM;
      setValue("scale", scale);
      setWheelPanning(true);
    } else if (width > 640) {
      scale = PDF_SETTINGS.SCALE.INITIAL;
      setValue("scale", scale);
    }
    // if scale is initial, center the view
    if (scale === PDF_SETTINGS.SCALE.INITIAL) {
      transformRef.current.centerView(initialScale, 0);
      return;
    }
  }, [windowSize]);

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
          wrapperClass="relative !w-screen !h-[calc(100vh-104px)] lg:!h-[calc(100vh-64px)] flex-auto min-w-[60%] 2xl:min-w-[65%] xl:!w-auto"
          contentClass="items-start justify-center pointer-events-none"
          contentStyle={{ width: "100%", transition: "transform 0.1s" }}
        >
          <div className="bg-white shadow-2xl p-5">
            <Page mode="preview" />
          </div>
        </TransformComponent>
        <div className="flex justify-center items-center absolute z-20 lg:z-50 left-0 right-0 top-[104px] sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:top-auto sm:bottom-4 transform sm:px-3">
          <Controls
            elem={transformRef}
            wheelPanning={wheelPanning}
            setWheelPanning={setWheelPanning}
          />
        </div>
      </>
    </TransformWrapper>
  );
};
