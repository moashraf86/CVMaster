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
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";

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

  // on submit function
  function onSubmit(data: z.infer<typeof skillsSchema>) {
    // Generate Unique ID If creating
    const dataWithId = isEditMode
      ? {
          ...data,
          id: skills[index].id,
        }
      : {
          ...data,
          id: crypto.randomUUID(),
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
      setKeywords([...keywords, newKeyword]);
      form.setValue("keywords", [
        ...(form.getValues("keywords") || []),
        newKeyword,
      ]);
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
    const clipboardKeywords = clipboardData.split(",");
    setKeywords([...keywords, ...clipboardKeywords]);
    form.setValue("keywords", [
      ...(form.getValues("keywords") || []),
      ...clipboardKeywords,
    ]);
    form.setValue("keyword", "");
  };

  // delete keyword
  const deleteKeyword = (index: number) => () => {
    setToDeleteKeyword(index);
    setTimeout(() => {
      const newKeywords = keywords.filter((_, i) => i !== index);
      setKeywords(newKeywords);
      form.setValue("keywords", newKeywords);
      setToDeleteKeyword(null);
    }, 300);
  };

  useEffect(() => {
    // set the keywords to the keywords in the form state
    setKeywords(isEditMode ? skills[index].keywords : []);
    // reset the form
    form.reset(defaultValues);
  }, [index, skills]);

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
                      <Input placeholder="Languages" {...field} />
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
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input
                        onKeyDown={addKeyword}
                        onPaste={pasteKeywords}
                        placeholder="React, Node.js, MongoDB"
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
                    {/* display keywords here */}
                    <ul
                      className="flex items-center flex-wrap gap-2"
                      role="list"
                    >
                      {keywords.map((keyword, index) => (
                        <li
                          role="listitem"
                          onClick={deleteKeyword(index)}
                          key={keyword}
                          className={cn(
                            "inline-flex gap-2 items-center px-3 py-0.5 bg-primary text-primary-foreground rounded-full text-sm cursor-pointer animate-in slide-in-from-top fade-in duration-300",
                            toDeleteKeyword === index &&
                              "animate-out slide-out-to-left fade-out duration-300"
                          )}
                        >
                          {keyword}
                          <X size={16} />
                        </li>
                      ))}
                    </ul>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="flex ms-auto">
              {isEditMode ? "Save Changes" : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
