import { Pencil, Trash } from "lucide-react";
import { Button } from "../../ui/button";
import { useDialog } from "../../../hooks/useDialog";
import { useResume } from "../../../store/useResume";
import { SectionIcon } from "./SectionIcon";
import { Section, SectionItem, SectionName } from "../../../types/types";
import { useState, useMemo } from "react";
import { DeleteConfirmation } from "../../core/DeleteConfirmation";
import { cn } from "../../../lib/utils";

export const SectionBase: React.FC<Section> = ({ name, itemsCount, id }) => {
  const { openDialog, updateDialog } = useDialog();
  const { resumeData, setData } = useResume();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    index: number | null;
  }>({
    isOpen: false,
    index: null,
  });
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // get the section data from the local storage or the resumeData
  const sectionData = useMemo(() => {
    try {
      const localData = JSON.parse(localStorage.getItem("resumeData") || "{}");
      return localData[id] || resumeData[id] || [];
    } catch {
      return resumeData[id] || [];
    }
  }, [id, resumeData]);

  // handle delete function for each item in the section
  const handleDelete = (id: SectionName, index: number) => () => {
    setItemToDelete(index);
    setTimeout(() => {
      const newData = [...sectionData].filter((_, i) => i !== index);
      setData({ [id]: newData });
      setItemToDelete(null);
    }, 300);
  };

  return (
    <section className="grid gap-y-6" id={id}>
      <header className="flex items-center gap-4">
        <SectionIcon section={id as SectionName} />
        <h2 className="text-2xl font-bold">{name}</h2>
      </header>
      <ul className="grid gap-4 sm:grid-col-2">
        {itemsCount > 0 &&
          sectionData.map((item: SectionItem, index: number) => (
            <li
              key={item.id as string}
              className={cn(
                "border border-border p-4 duration-300",
                itemToDelete === index &&
                  "animate-out slide-out-to-left fade-out duration-300"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-bold">{item.name}</h3>
                  {
                    // check if the section has a position or description or keywords
                    item.position ? (
                      <p className="text-sm text-text-muted">{item.position}</p>
                    ) : item.description ? (
                      <p className="text-sm text-text-muted">
                        {item.description}
                      </p>
                    ) : item.keywords ? (
                      <p className="text-sm text-text-muted">
                        {item.keywords.length} keywords
                      </p>
                    ) : item.studyField ? (
                      <p className="text-sm text-text-muted">
                        {item.studyField}
                      </p>
                    ) : item.level ? (
                      <p className="text-sm text-text-muted">{item.level}</p>
                    ) : item.issuer ? (
                      <p className="text-sm text-text-muted">{item.issuer}</p>
                    ) : null
                  }
                </div>
                <div className="flex">
                  <Button
                    aria-label={`Edit ${item.name}`}
                    title="Edit"
                    variant="ghost"
                    size="icon"
                    onClick={() => updateDialog(id, index)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    aria-label={`Delete ${item.name}`}
                    title="Delete"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDeleteDialog({ isOpen: true, index: index });
                    }}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        {itemsCount === 0 && (
          <Button
            aria-label={`add new item to ${name}`}
            variant="outline"
            size="lg"
            className="border-dashed h-12"
            onClick={() => openDialog(id)}
          >
            Add new item
          </Button>
        )}
      </ul>
      {itemsCount > 0 && (
        <footer>
          <Button
            aria-label={`Add new item to ${name}`}
            variant="outline"
            className="flex ms-auto"
            onClick={() => openDialog(id)}
          >
            + Add new item
          </Button>
        </footer>
      )}
      <DeleteConfirmation
        isOpen={deleteDialog.isOpen}
        setIsOpen={(open) =>
          setDeleteDialog((prev) => ({ ...prev, isOpen: open }))
        }
        handleDelete={() =>
          deleteDialog.index !== null && handleDelete(id, deleteDialog.index)()
        }
      />
    </section>
  );
};
