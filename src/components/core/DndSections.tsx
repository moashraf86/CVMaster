import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useResume } from "../../store/useResume";
import { SectionName } from "../../types/types";
import { SortableItem } from "./SortableItem";

export default function DndSections() {
  const { sectionOrder, setSectionOrder } = useResume();

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  return (
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
  );
}
