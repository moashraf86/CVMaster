import { useCallback, useEffect, useRef } from "react";
import { usePdfSettings } from "../store/useResume";
import { PDF_SETTINGS } from "../lib/constants";

// Custom hook to get the gesture zoom handler
export const useGestureZoomHandler = () => {
  const {
    setValue,
    pdfSettings: { scale: pdfScale },
  } = usePdfSettings();

  const throttleRef = useRef<NodeJS.Timeout | null>(null);
  const handleGestureZoom = useCallback(
    (ref: { state: { scale: number } }) => {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }

      throttleRef.current = setTimeout(() => {
        const currentScale = ref.state.scale;
        const clampedScale = Math.max(
          PDF_SETTINGS.SCALE.MIN,
          Math.min(PDF_SETTINGS.SCALE.MAX, currentScale)
        );

        if (Math.abs(clampedScale - pdfScale) > 0.01) {
          setValue("scale", clampedScale);
        }
      }, 100);
    },
    [setValue, pdfScale]
  );

  useEffect(() => {
    return () => {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, []);

  return handleGestureZoom;
};
