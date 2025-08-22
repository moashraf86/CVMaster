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
} from "../../ui/form";
import { Input } from "../../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDialog } from "../../../hooks/useDialog";
import { useResume } from "../../../store/useResume";
import { Button } from "../../ui/button";
import { useEffect } from "react";
import { Education } from "../../../types/types";
import { RichTextEditor } from "../../core/RichTextEditor";

// define education schema
const educationSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  degree: z.string().trim(),
  studyField: z.string().trim().min(1, { message: "Study Field is required" }),
  date: z.string().trim().min(1, { message: "Date range is required" }),
  website: z.literal("").or(z.string().url()),
  summary: z.string().trim(),
});

// Define the form
export const EducationDialog: React.FC = () => {
  const { isOpen, closeDialog, index } = useDialog();
  const {
    setData,
    resumeData: { education },
  } = useResume();

  // check if user is in edit mode
  const isEditMode = education && index !== null && education[index];

  // define default values for the form
  const defaultValues: Education = isEditMode
    ? education[index]
    : {
        id: "",
        name: "",
        degree: "",
        studyField: "",
        date: "",
        website: "",
        summary: "",
      };

  // define form
  const form = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues,
  });

  // on submit function
  function onSubmit(data: z.infer<typeof educationSchema>) {
    // Generate Unique ID if creating
    const dataWithId = isEditMode
      ? { ...data, id: education[index].id } // keep existing ID if editing
      : { ...data, id: crypto.randomUUID() }; // Generate new ID if creating

    // Update the education array
    const updatedData = isEditMode
      ? education.map((edu: Education, i: number) =>
          i === index ? dataWithId : edu
        )
      : [...education, dataWithId];

    // set the data in the store
    setData({
      education: updatedData,
    });

    closeDialog();
    form.reset();
  }

  useEffect(() => {
    form.reset(defaultValues);
  }, [index, education]);

  return (
    <Dialog open={isOpen("education")} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Education" : "Add Education"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edit your education history"
              : "Add your education history"}
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
                    <FormLabel>School</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Cairo university" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Bachelor's degree" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studyField"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Study Field</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Computer Science" {...field} />
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
                    <FormLabel>Date Range</FormLabel>
                    <FormControl>
                      <Input placeholder="Jan 2020 - Jan 2024" {...field} />
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
