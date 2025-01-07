import { Pencil, Trash } from "lucide-react";
import { Button } from "../../ui/button";
import { useDialog } from "../../../hooks/useDialog";
import { useResume } from "../../../store/useResume";
import { SectionIcon } from "./SectionIcon";
import { Section, SectionName } from "../../../types/types";
import { useState } from "react";
import { DeleteConfirmation } from "../../core/DeleteConfirmation";

export const SectionBase: React.FC<Section> = ({ name, itemsCount, id }) => {
  const { openDialog, updateDialog } = useDialog();
  const { resumeData, setData } = useResume();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // get the data from the local storage or the resumeData
  let data;
  try {
    data = JSON.parse(localStorage.getItem("resumeData") || "{}");
  } catch (error) {
    console.log(error);
    data = resumeData;
  }

  // get the section data from the local storage or the resumeData
  const sectionData = data[id] || resumeData[id] || [];

  // handle delete function for each item in the section
  const handleDelete = (id: SectionName, index: number) => () => {
    const sectionData = resumeData[id];
    if (!Array.isArray(sectionData)) return;
    const newData = sectionData.filter((_, i) => i !== index);
    setData({ [id]: newData });
  };

  return (
    <section className="grid gap-y-6" id={id}>
      <header className="flex items-center gap-4">
        <SectionIcon section={id as SectionName} />
        <h2 className="text-2xl font-bold">{name}</h2>
      </header>
      <main className="grid gap-4 sm:grid-col-2" role="list">
        {itemsCount > 0 &&
          Array.from({ length: itemsCount }).map((_, index) => (
            <div
              key={index}
              className="border border-border p-4"
              role="listitem"
              aria-label={`${sectionData[index].name} - ${sectionData[index].position}`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-bold">
                    {sectionData[index].name}
                  </h3>
                  {
                    // check if the section has a position or description or keywords
                    sectionData[index].position ? (
                      <p className="text-sm text-text-muted">
                        {sectionData[index].position}
                      </p>
                    ) : sectionData[index].description ? (
                      <p className="text-sm text-text-muted">
                        {sectionData[index].description}
                      </p>
                    ) : sectionData[index].keywords ? (
                      <p className="text-sm text-text-muted">
                        {sectionData[index].keywords.length} keywords
                      </p>
                    ) : sectionData[index].studyField ? (
                      <p className="text-sm text-text-muted">
                        {sectionData[index].studyField}
                      </p>
                    ) : sectionData[index].level ? (
                      <p className="text-sm text-text-muted">
                        {sectionData[index].level}
                      </p>
                    ) : sectionData[index].issuer ? (
                      <p className="text-sm text-text-muted">
                        {sectionData[index].issuer}
                      </p>
                    ) : null
                  }
                </div>
                <div className="flex">
                  <Button
                    aria-label={`Edit ${sectionData[index].name}`}
                    title="Edit"
                    variant="ghost"
                    size="icon"
                    onClick={() => updateDialog(id, index)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    aria-label={`Delete ${sectionData[index].name}`}
                    title="Delete"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsOpen(true);
                      setSelectedIndex(index);
                    }}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            </div>
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
      </main>
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
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleDelete={() =>
          selectedIndex !== null && handleDelete(id, selectedIndex)()
        }
      />
    </section>
  );
};
