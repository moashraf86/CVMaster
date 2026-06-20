import { Fragment } from "react";

interface PageBreakLinesProps {
  totalHeight: number;
  width: number;
  height: number;
  margin: { VALUE: number };
  enabled: boolean;
}

export const PageBreakLines: React.FC<PageBreakLinesProps> = ({
  totalHeight,
  width,
  height,
  margin,
  enabled,
}) => {
  const pageCount = Math.max(
    1,
    Math.ceil((totalHeight - margin.VALUE * 2) / height)
  );

  if (!enabled || pageCount <= 1) return null;

  return (
    <>
      {Array.from({ length: pageCount - 1 }).map((_, i) => (
        <Fragment key={i}>
          <hr
            className="absolute w-full left-0"
            style={{
              top: `${(i + 1) * height + margin.VALUE / 2}px`,
              borderTop: "1px dashed transparent",
              borderImage:
                "repeating-linear-gradient(to right, black 0, black 8px, transparent 8px, transparent 16px) 1",
            }}
          />
          <span
            className="absolute inline-block text-xs border border-border rounded-full py-1.5 px-2 text-muted-foreground whitespace-nowrap pointer-events-none"
            style={{
              top: `${(i + 1) * height + margin.VALUE / 2 - 12}px`,
              right: `${width + 64}px`,
            }}
          >
            Page {i + 2} starts
          </span>
        </Fragment>
      ))}
    </>
  );
};
