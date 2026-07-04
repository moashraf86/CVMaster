import { DependencyList, RefObject, useEffect, useState } from "react";

export function useContentHeight(
  ref: RefObject<HTMLElement>,
  enabled: boolean,
  deps: DependencyList
): number {
  const [totalHeight, setTotalHeight] = useState(0);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const root = ref.current;
    let cancelled = false;

    const measure = () => {
      if (cancelled || !root) return;
      setTotalHeight(root.offsetHeight);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(root);

    const runMeasure = async () => {
      try {
        if (document?.fonts?.ready) {
          await document.fonts.ready;
        }
      } catch {
        // ignore font load errors and measure with fallback metrics
      }
      if (cancelled) return;
      measure();
    };

    runMeasure();

    return () => {
      cancelled = true;
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ref, ...deps]);

  return totalHeight;
}
