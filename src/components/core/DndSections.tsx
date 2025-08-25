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
  const {
    sectionOrder,
    setSectionOrder,
    resumeData: { sectionTitles },
  } = useResume();

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

  // Sync section order names with section titles
  const sectionOrderWithTitles = sectionOrder.map((sectionId) => ({
    id: sectionId,
    title: sectionTitles[sectionId],
  }));

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
        {sectionOrderWithTitles.map((section) => (
          <SortableItem key={section.id} id={section.id}>
            {section.title}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}
