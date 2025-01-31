import {
  ReactZoomPanPinchRef,
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";
import { Page } from "../preview";
import { Controls } from "../core/Controls";
import { useEffect, useRef } from "react";
import { useWindowSize } from "@uidotdev/usehooks";

export const Preview: React.FC = () => {
  const ref = useRef<ReactZoomPanPinchRef>(null);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (ref.current) {
      // check if the window size is less than 768px
      if (windowSize.width !== null && windowSize.width < 768) {
        // set the initial scale to 1
        ref.current.centerView(1);
      } else {
        // set the initial scale to 0.75
        ref.current.centerView(0.75);
      }
    }
  }, [windowSize]);

  return (
    <TransformWrapper
      ref={ref}
      centerZoomedOut={true}
      centerOnInit={true}
      initialScale={0.75}
      maxScale={2}
      minScale={0.5}
      limitToBounds={false}
    >
      <>
        <TransformComponent
          wrapperClass="relative !w-screen !h-screen flex-auto min-w-[60%] 2xl:min-w-[65%] xl:!w-auto"
          contentClass="items-start justify-center pointer-events-none"
          contentStyle={{ width: "100%", transition: "transform 0.1s" }}
        >
          <Page mode="preview" />
        </TransformComponent>
        <div className="flex fixed justify-center items-center z-20 lg:z-50 left-0 right-0 bottom-0 px-1.5 py-2">
          <Controls />
        </div>
      </>
    </TransformWrapper>
  );
};
