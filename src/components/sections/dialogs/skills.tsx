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

// define skills schema
const projectsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  keyword: z.string(),
  keywords: z.array(z.string()),
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
  // check if user is in edit mode
  const isEditMode = skills && index !== null && skills[index];

  // define default values for the form
  const defaultValues = isEditMode
    ? skills[index]
    : {
        name: "",
        keyword: "",
        keywords: [""],
      };

  // define form
  const form = useForm<z.infer<typeof projectsSchema>>({
    resolver: zodResolver(projectsSchema),
    defaultValues,
  });

  // on submit function
  function onSubmit(data: z.infer<typeof projectsSchema>) {
    const updatedSkills = skills
      ? index !== null
        ? skills.map((skill: Skill, i: number) => (i === index ? data : skill))
        : [...skills, data]
      : [data];
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
      setKeywords([...keywords, form.getValues("keyword")]);
      form.setValue("keywords", [
        ...form.getValues("keywords"),
        form.getValues("keyword"),
      ]);
      form.setValue("keyword", "");
    }
  };

  // handle paste
  const pasteKeywords = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // if user pastes text, split the text by comma and add to the keywords array
    e.preventDefault();
    const clipboardData = e.clipboardData.getData("text");
    const clipboardKeywords = clipboardData.split(",");
    setKeywords([...keywords, ...clipboardKeywords]);
    form.setValue("keywords", [
      ...form.getValues("keywords"),
      ...clipboardKeywords,
    ]);
    form.setValue("keyword", "");
  };

  // delete keyword
  const deleteKeyword = (index: number) => () => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(newKeywords);
    form.setValue("keywords", newKeywords);
  };

  useEffect(() => {
    // set the keywords to the keywords in the form state
    setKeywords(isEditMode ? skills[index].keywords : []);
    form.reset(defaultValues);
  }, [index, skills]);

  return (
    <Dialog open={isOpen("skills")} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Skill" : "Add Skill"}</DialogTitle>
          <DialogDescription hidden>
            Add / Edit your skills and keywords
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
                      />
                    </FormControl>
                    <FormDescription>
                      You can add multiple keywords by separating them with a
                      comma or pressing enter.
                    </FormDescription>
                    <FormMessage />
                    {/* display keywords here */}
                    <div className="flex items-center flex-wrap gap-2">
                      {keywords.map((keyword, index) => (
                        <span
                          onClick={deleteKeyword(index)}
                          key={index}
                          className="inline-flex gap-2 items-center px-3 py-0.5 bg-primary text-primary-foreground rounded-full text-sm cursor-pointer"
                        >
                          {keyword}
                          <X size={16} />
                        </span>
                      ))}
                    </div>
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
