import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDialog } from "../../../hooks/useDialog";
import { useResume } from "../../../store/useResume";
import { Button } from "../../ui/button";
import { useEffect, useState } from "react";
import { Project } from "../../../types/types";
import { X } from "lucide-react";
import { RichTextEditor } from "../../core/RichTextEditor";
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
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { SortableKeyword } from "./SortableKeyword";

// define projects schema
const projectsSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  description: z.string().trim(),
  date: z.string().trim(),
  website: z.literal("").or(z.string().url()),
  summary: z.string(),
  keyword: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

// Define the form
export const ProjectsDialog: React.FC = () => {
  const { isOpen, closeDialog, index } = useDialog();
  const {
    setData,
    resumeData: { projects },
  } = useResume();
  const [keywords, setKeywords] = useState<string[]>(
    projects && index !== null ? projects[index].keywords : []
  );
  const [orderedKeywords, setOrderedKeywords] = useState<string[]>([]);
  const [toDeleteKeyword, setToDeleteKeyword] = useState<number | null>(null);
  // check if user is in edit mode
  const isEditMode = projects && index !== null && projects[index];

  // define default values for the form
  const defaultValues: Project = isEditMode
    ? projects[index]
    : {
        // set to empty later
        id: "",
        name: "",
        description: "",
        date: "",
        website: "",
        summary: "",
        keyword: "",
        keywords: [],
      };

  // define form
  const form = useForm<z.infer<typeof projectsSchema>>({
    resolver: zodResolver(projectsSchema),
    defaultValues,
  });

  // sensor for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // handle drag-and-drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = orderedKeywords.indexOf(active.id as string);
      const newIndex = orderedKeywords.indexOf(over.id as string);
      const newOrder = arrayMove(orderedKeywords, oldIndex, newIndex);
      setOrderedKeywords(newOrder);
    }
  };

  // on submit function
  function onSubmit(data: z.infer<typeof projectsSchema>) {
    // Generate unique id for the project
    const projectWithId = isEditMode
      ? {
          ...data,
          id: projects[index].id,
          keywords: orderedKeywords,
        }
      : {
          ...data,
          id: crypto.randomUUID(),
          keywords: orderedKeywords,
        };

    const currentProjects = projects;
    const updatedProjects = isEditMode
      ? currentProjects.map((project: Project, i: number) =>
          i === index ? projectWithId : project
        )
      : [...currentProjects, projectWithId];
    setData({
      projects: updatedProjects,
    });
    closeDialog();
    form.reset();
  }

  // handle keywords
  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // check if the key pressed is enter
    // add new keyword to the keywords array in the form state and reset the input field
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      // check if the keyword is not empty or duplicate
      const newKeyword = form.getValues("keyword")?.trim() || "";
      if (!newKeyword || keywords.includes(newKeyword)) return;

      const newKeywords = [...keywords, newKeyword];
      const newOrder = [...orderedKeywords, newKeyword];
      setKeywords(newKeywords);
      setOrderedKeywords(newOrder);
      form.setValue("keywords", newKeywords);
      form.setValue("keyword", "");
    }
    // clear the error message
    form.clearErrors("keywords");
  };

  // handle paste
  const pasteKeywords = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // if user pastes text, split the text by comma and add to the keywords array
    e.preventDefault();
    const clipboardData = e.clipboardData.getData("text");
    // remove duplicated	 keywords
    const clipboardKeywords = clipboardData
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword && !keywords.includes(keyword));

    // add the new keywords to the keywords array and the ordered keywords array
    const newKeywords = [...keywords, ...clipboardKeywords];
    const newOrder = [...orderedKeywords, ...clipboardKeywords];

    // update the keywords and keywords order in the resume data
    setKeywords(newKeywords);
    setOrderedKeywords(newOrder);
    form.setValue("keywords", newKeywords);
    form.setValue("keyword", "");
  };

  // delete keyword
  const deleteKeyword = (keywordToDelete: string) => () => {
    const keywordIndex = keywords.indexOf(keywordToDelete);
    setToDeleteKeyword(keywordIndex);

    setTimeout(() => {
      const newKeywords = keywords.filter((k) => k !== keywordToDelete);
      const newOrder = orderedKeywords.filter((k) => k !== keywordToDelete);

      setKeywords(newKeywords);
      setOrderedKeywords(newOrder);
      form.setValue("keywords", newKeywords);
      setToDeleteKeyword(null);
    }, 300);
  };

  // handle clear keywords
  const handleClearKeywords = () => {
    setKeywords([]);
    setOrderedKeywords([]);
    form.setValue("keyword", "");
    form.setValue("keywords", []);
    form.clearErrors("keywords");
  };

  useEffect(() => {
    // if dialog is open, update the keywords and keywords order
    if (isEditMode && projects[index]) {
      const project = projects[index];
      setKeywords(project.keywords || []);
      setOrderedKeywords(project.keywords || []);
    } else {
      setKeywords([]);
      setOrderedKeywords([]);
    }
    // reset the form
    form.reset(defaultValues);
  }, [index, projects, isOpen]);

  return (
    <Dialog open={isOpen("projects")} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Project" : "Add Project"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edit a project you have worked on in the past or currently working on"
              : "Add a project you have worked on in the past or currently working on"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Project Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Full-stack web app" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex:Jan 2020" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          content={field.value}
                          handleChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-2 gap-4">
                <FormField
                  control={form.control}
                  name="keyword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Keywords</FormLabel>
                        <Button
                          type="button"
                          aria-label="Clear All Keywords"
                          variant="ghost"
                          size="sm"
                          onClick={handleClearKeywords}
                          disabled={keywords.length === 0}
                        >
                          <X className="!size-4" /> Clear All
                        </Button>
                      </div>
                      <FormControl>
                        <Input
                          onKeyDown={addKeyword}
                          onPaste={pasteKeywords}
                          placeholder="ex: React, Node.js, MongoDB"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can add multiple keywords by separating them with a
                        comma or pressing enter.
                      </FormDescription>
                      <FormMessage />
                      {/* Sortable Keywords Display */}
                      {keywords.length > 0 && (
                        <div className="mt-4">
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                          >
                            <SortableContext
                              items={orderedKeywords}
                              strategy={horizontalListSortingStrategy}
                            >
                              <ul className="flex flex-wrap gap-2">
                                {orderedKeywords.map((keyword) => {
                                  return (
                                    <SortableKeyword
                                      key={keyword}
                                      id={keyword}
                                      keyword={keyword}
                                      onDelete={deleteKeyword(keyword)}
                                      isDeleting={
                                        toDeleteKeyword ===
                                        keywords.indexOf(keyword)
                                      }
                                    />
                                  );
                                })}
                              </ul>
                            </SortableContext>
                          </DndContext>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" className="flex w-full sm:w-auto ms-auto">
              {isEditMode ? "Save Changes" : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
