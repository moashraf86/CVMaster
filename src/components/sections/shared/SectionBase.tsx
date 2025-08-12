import { Copy, Pencil, Trash } from "lucide-react";
import { Button } from "../../ui/button";
import { useDialog } from "../../../hooks/useDialog";
import { useResume } from "../../../store/useResume";
import { SectionIcon } from "./SectionIcon";
import { Section, SectionItem, SectionName } from "../../../types/types";
import { useState, useMemo, useRef, useEffect } from "react";
import { DeleteConfirmation } from "../../core/dialogs/DeleteConfirmation";
import { cn } from "../../../lib/utils";
import { Input } from "../../ui/input";

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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [sectionTitle, setSectionTitle] = useState(
    resumeData.sectionTitles[id] || name
  );

  // Track rendered items to prevent re-animation
  const renderedItems = useRef(new Set<string>());
  const previousDataLength = useRef(0);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSectionTitle(e.target.value);
  };
  // save the title to the resumeData
  const saveTitle = () => {
    setIsEditingTitle(false);
    setData({
      sectionTitles: { ...resumeData.sectionTitles, [id]: sectionTitle },
    });
  };

  // get the section data from the local storage or the resumeData
  const sectionData = useMemo(() => {
    try {
      const localData = JSON.parse(localStorage.getItem("resumeData") || "{}");
      return localData[id] || resumeData[id] || [];
    } catch {
      return resumeData[id] || [];
    }
  }, [id, resumeData]);

  // Update rendered items tracking
  useEffect(() => {
    const currentLength = sectionData.length;
    const wasItemAdded = currentLength > previousDataLength.current;

    if (wasItemAdded) {
      // Only the new item should animate in
      const newItems = sectionData.slice(previousDataLength.current);
      newItems.forEach((item: SectionItem) => {
        if (!renderedItems.current.has(item.id as string)) {
          // New item will animate in naturally
        }
      });
    }

    // Update tracking
    sectionData.forEach((item: SectionItem) => {
      renderedItems.current.add(item.id as string);
    });

    previousDataLength.current = currentLength;
  }, [sectionData]);

  // Clean up tracking for deleted items
  useEffect(() => {
    const currentIds = new Set(sectionData.map((item: SectionItem) => item.id));
    const trackedIds = Array.from(renderedItems.current);

    trackedIds.forEach((id) => {
      if (!currentIds.has(id)) {
        renderedItems.current.delete(id);
      }
    });
  }, [sectionData]);

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
        {isEditingTitle ? (
          <Input
            value={sectionTitle}
            onChange={handleTitleChange}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") saveTitle();
            }}
            className="w-auto"
            autoFocus
          />
        ) : (
          <h2
            className="text-2xl font-bold cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
          >
            {resumeData.sectionTitles[id] || name}
          </h2>
        )}
        <Button
          title="Edit title"
          variant="ghost"
          size="icon"
          className="rounded-full ms-auto"
          onClick={() => setIsEditingTitle(true)}
        >
          <Pencil />
        </Button>
      </header>
      <ul className="grid gap-4 sm:grid-col-2">
        {itemsCount > 0 &&
          sectionData.map((item: SectionItem, index: number) => {
            // Check if this item should animate in (new item)
            const shouldAnimateIn = !renderedItems.current.has(
              item.id as string
            );

            return (
              <li
                key={item.id as string}
                className={cn(
                  "border border-border p-4 duration-300 group rounded-sm",
                  shouldAnimateIn && "animate-in slide-in-from-top fade-in",
                  itemToDelete === index &&
                    "animate-out slide-out-to-left fade-out"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold">{item.name}</h3>
                    {
                      // check if the section has a position or description or keywords
                      item.position ? (
                        <p className="text-sm text-text-muted">
                          {item.position}
                        </p>
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
                  <div className="lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex">
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
                      aria-label={`Duplicate ${item.name}`}
                      title="Duplicate"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // duplicate the item
                        const newItem = {
                          ...item,
                          id: crypto.randomUUID(),
                        };
                        setData({ [id]: [...sectionData, newItem] });
                      }}
                    >
                      <Copy />
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
            );
          })}
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
            className="flex me-auto"
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
