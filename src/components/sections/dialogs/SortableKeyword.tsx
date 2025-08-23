import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { cn } from "../../../lib/utils";

interface SortableKeywordProps {
  id: string;
  keyword: string;
  onDelete: (e: React.MouseEvent) => void;
  isDeleting?: boolean;
}

export const SortableKeyword: React.FC<SortableKeywordProps> = ({
  id,
  keyword,
  onDelete,
  isDeleting = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(e);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm active:cursor-grabbing animate-in zoom-in-95 fade-in-95 duration-50",
        isDragging && "opacity-50 cursor-grabbing",
        isDeleting && "animate-out slide-out-to-left fade-out duration-300 "
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-primary/80 rounded"
      >
        <GripVertical className="w-3 h-3" />
      </div>

      <span>{keyword}</span>

      <button
        type="button"
        onClick={handleDeleteClick}
        className="p-0.5 hover:bg-primary/80 rounded transition-colors relative z-20"
        aria-label={`Remove ${keyword}`}
        style={{ pointerEvents: "auto" }}
      >
        <X className="w-3 h-3" />
      </button>
    </li>
  );
};
