import { Pencil, Trash } from "lucide-react";
import { Button } from "../../ui/button";
import { useDialog } from "../../../hooks/useDialog";
import { useResume } from "../../../store/useResume";
import { SectionIcon } from "./SectionIcon";
import { Section, SectionItem, SectionName } from "../../../types/types";

export const SectionBase: React.FC<Section> = ({ name, itemsCount, id }) => {
  const { openDialog, updateDialog } = useDialog();
  const { resumeData, setData } = useResume();

  // handle delete function for each item in the section
  const handleDelete = (id: string, index: number) => () => {
    const newData = resumeData[id].filter(
      (_: SectionItem, i: number) => i !== index
    );
    // update the experience data
    setData({ [id]: newData });
  };

  return (
    <section className="grid gap-y-6" id={id}>
      <header className="flex items-center gap-4">
        <SectionIcon section={id as SectionName} />
        <h2 className="text-2xl font-bold">{name}</h2>
      </header>
      <main className="grid gap-4 sm:grid-col-2">
        {itemsCount > 0 &&
          Array.from({ length: itemsCount }).map((_, index) => (
            <div key={index} className="border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-bold">
                    {resumeData[id][index].name}
                  </h3>
                  {
                    // check if the section has a position or description or keywords
                    resumeData[id][index].position ? (
                      <p className="text-sm text-text-muted">
                        {resumeData[id][index].position}
                      </p>
                    ) : resumeData[id][index].description ? (
                      <p className="text-sm text-text-muted">
                        {resumeData[id][index].description}
                      </p>
                    ) : resumeData[id][index].keywords ? (
                      <p className="text-sm text-text-muted">
                        {resumeData[id][index].keywords.length} keywords
                      </p>
                    ) : resumeData[id][index].studyField ? (
                      <p className="text-sm text-text-muted">
                        {resumeData[id][index].studyField}
                      </p>
                    ) : resumeData[id][index].level ? (
                      <p className="text-sm text-text-muted">
                        {resumeData[id][index].level}
                      </p>
                    ) : resumeData[id][index].issuer ? (
                      <p className="text-sm text-text-muted">
                        {resumeData[id][index].issuer}
                      </p>
                    ) : null
                  }
                </div>
                <div className="flex">
                  <Button
                    title="Edit"
                    variant="ghost"
                    size="icon"
                    onClick={() => updateDialog(id, index)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    title="Delete"
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete(id, index)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        {itemsCount === 0 && (
          <Button
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
            variant="outline"
            className="flex ms-auto"
            onClick={() => openDialog(id)}
          >
            + Add new item
          </Button>
        </footer>
      )}
    </section>
  );
};
