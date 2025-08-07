import {
  ReactZoomPanPinchRef,
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";
import { Page } from "../preview";
import { Controls } from "../core/Controls";
import { useEffect, useRef } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { useGestureZoomHandler } from "../../hooks/useGestureZoomHandler";
import { PDF_SETTINGS } from "../../lib/constants";

export const Preview: React.FC = () => {
  const ref = useRef<ReactZoomPanPinchRef>(null);
  const windowSize = useWindowSize();

  const handleGestureZoom = useGestureZoomHandler();

  useEffect(() => {
    const width = windowSize.width;

    if (!ref.current || width === null) return;

    let scale = 0.65; // default

    if (width < 430) {
      scale = 0.4;
    } else if (width < 640) {
      scale = 0.5;
    }

    ref.current.centerView(scale);
  }, [windowSize]);

  return (
    <TransformWrapper
      ref={ref}
      centerZoomedOut={true}
      centerOnInit={true}
      initialScale={PDF_SETTINGS.SCALE.INITIAL}
      maxScale={PDF_SETTINGS.SCALE.MAX}
      minScale={PDF_SETTINGS.SCALE.MIN}
      limitToBounds={false}
      onZoom={handleGestureZoom}
      onZoomStop={handleGestureZoom}
      smooth={true}
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
        <div className="flex justify-center items-center absolute z-20 lg:z-50 left-0 right-0 top-[104px] sm:top-auto sm:bottom-4 transform sm:px-3">
          <Controls />
        </div>
      </>
    </TransformWrapper>
  );
};
