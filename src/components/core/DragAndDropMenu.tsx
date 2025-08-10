import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useResume } from "../../store/useResume";
import { SortableItem } from "./SortableItem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { SectionName } from "../../types/types";

interface DragAndDropMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DragAndDropMenu: React.FC<DragAndDropMenuProps> = ({
  isOpen,
  onClose,
}) => {
  const { sectionOrder, setSectionOrder } = useResume();

  // Handle drag-and-drop reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as SectionName);
      const newIndex = sectionOrder.indexOf(over.id as SectionName);

      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      setSectionOrder(newOrder);
    }
  };

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reorder Sections</DialogTitle>
          <DialogDescription>
            Drag and drop to reorder the sections of your resume.
          </DialogDescription>
        </DialogHeader>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sectionOrder}
            strategy={verticalListSortingStrategy}
          >
            {sectionOrder.map((sectionId) => (
              <SortableItem key={sectionId} id={sectionId}>
                {sectionId}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </DialogContent>
    </Dialog>
  );
};
