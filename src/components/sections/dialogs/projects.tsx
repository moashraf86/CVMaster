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
import { cn } from "../../../lib/utils";

// define projects schema
const projectsSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  description: z.string().trim(),
  date: z.string().trim(),
  website: z.literal("").or(z.string().url()),
  summary: z.string(),
  keyword: z.string(),
  keywords: z.array(z.string()),
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

  // on submit function
  function onSubmit(data: z.infer<typeof projectsSchema>) {
    // Remove duplicate keywords
    const uniqueKeywords = [...new Set(data.keywords)];
    const cleanedData = { ...data, keywords: uniqueKeywords };
    // Generate unique id for the project
    const projectWithId = isEditMode
      ? { ...cleanedData, id: projects[index].id }
      : { ...cleanedData, id: crypto.randomUUID() };

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
      const newKeyword = form.getValues("keyword").trim();
      if (!newKeyword || keywords.includes(newKeyword)) return;
      setKeywords([...keywords, newKeyword]);
      form.setValue("keywords", [...form.getValues("keywords"), newKeyword]);
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
    setKeywords([...keywords, ...clipboardKeywords]);
    form.setValue("keywords", [
      ...form.getValues("keywords"),
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
    setKeywords(isEditMode ? projects[index].keywords : []);
    form.reset(defaultValues);
  }, [index, projects]);

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
                      <ul
                        className="flex items-center flex-wrap gap-2"
                        role="list"
                      >
                        {keywords.map((keyword, idx) => (
                          <li
                            key={keyword}
                            role="listitem"
                            onClick={deleteKeyword(idx)}
                            className={cn(
                              "inline-flex gap-2 items-center px-3 py-0.5 bg-primary text-primary-foreground rounded-full text-sm cursor-pointer animate-in slide-in-from-top fade-in duration-300",
                              toDeleteKeyword === idx &&
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
