import {
  ReactZoomPanPinchRef,
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";
import { Page } from "../preview";
import { Controls } from "../core/Controls";
import { useRef } from "react";

export const Preview: React.FC = () => {
  const ref = useRef<ReactZoomPanPinchRef>(null);

  return (
    <TransformWrapper
      ref={ref}
      centerZoomedOut={true}
      initialScale={1}
      maxScale={2}
      minScale={0.5}
      limitToBounds={false}
    >
      <>
        <TransformComponent
          wrapperClass="relative !w-screen !h-screen content-end"
          contentClass="items-start justify-center pointer-events-none"
          contentStyle={{ width: "100%", transition: "transform 0.1s" }}
        >
          <Page mode="preview" />
        </TransformComponent>
        <Controls />
      </>
    </TransformWrapper>
  );
};