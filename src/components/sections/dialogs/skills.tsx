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
import { Skill } from "../../../types/types";
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { SortableKeyword } from "./SortableKeyword";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { X } from "lucide-react";

// define skills schema
const skillsSchema = z.object({
  name: z.string().trim(),
  keyword: z.string().optional(),
  keywords: z.array(z.string()).min(1, { message: "Keywords are required" }),
});

// Define the form
export const SkillsDialog: React.FC = () => {
  const { isOpen, closeDialog, index } = useDialog();
  const {
    setData,
    resumeData: { skills },
  } = useResume();

  const [keywords, setKeywords] = useState<string[]>(
    skills && index !== null ? skills[index].keywords : []
  );
  const [orderedKeywords, setOrderedKeywords] = useState<string[]>([]);
  const [toDeleteKeyword, setToDeleteKeyword] = useState<number | null>(null);

  // check if user is in edit mode
  const isEditMode = skills && index !== null && skills[index];

  // define default values for the form
  const defaultValues: Skill = isEditMode
    ? skills[index]
    : {
        id: "",
        name: "",
        keyword: "",
        keywords: [],
      };

  // define form
  const form = useForm<z.infer<typeof skillsSchema>>({
    resolver: zodResolver(skillsSchema),
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
  function onSubmit(data: z.infer<typeof skillsSchema>) {
    // Generate Unique ID If creating
    const dataWithId = isEditMode
      ? {
          ...data,
          id: skills[index].id,
          keywords: orderedKeywords,
        }
      : {
          ...data,
          id: crypto.randomUUID(),
          keywords: orderedKeywords,
        };
    // update the skills array in the resume data
    const updatedSkills = isEditMode
      ? skills.map((skill: Skill, i: number) =>
          i === index ? dataWithId : skill
        )
      : [...skills, dataWithId];

    // update the skills in the resume data
    setData({
      skills: updatedSkills,
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
      // check  if the keyword is not empty or duplicate
      const newKeyword = form.getValues("keyword")?.trim() || "";
      if (!newKeyword || keywords.includes(newKeyword)) return;

      const newKeywords = [...keywords, newKeyword];
      const newOrder = [...orderedKeywords, newKeyword];

      // update the keywords and keywords order in the resume data
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
    // remove duplicated keywords
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
    if (isEditMode && skills[index]) {
      const skill = skills[index];
      setKeywords(skill.keywords || []);
      setOrderedKeywords(skill.keywords || []);
    } else {
      setKeywords([]);
      setOrderedKeywords([]);
    }
    // reset the form
    form.reset(defaultValues);
  }, [index, skills, isOpen]);

  return (
    <Dialog open={isOpen("skills")} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Skill" : "Add Skill"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edit your skills and keywords"
              : "Add your skills and keywords"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Languages" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Keywords</FormLabel>
                      <Button
                        aria-label="Clear All Keywords"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearKeywords}
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
                        hasError={form.formState.errors.keywords !== undefined}
                      />
                    </FormControl>
                    <FormDescription>
                      You can add multiple keywords by separating them with a
                      comma or pressing enter.
                    </FormDescription>
                    <FormMessage>
                      {form.formState.errors.keywords?.message}
                    </FormMessage>
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
            <Button type="submit" className="flex w-full sm:w-auto ms-auto">
              {isEditMode ? "Save Changes" : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
