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
import { Textarea } from "../../ui/textarea";
import { useEffect } from "react";
import { Education } from "../../../types/types";

// define education schema
const educationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  degree: z.string(),
  studyField: z.string().min(1, { message: "studyField is required" }),
  date: z.string().min(1, { message: "Date range is required" }),
  website: z.literal("").or(z.string().url()),
  summary: z.string(),
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
  const defaultValues = isEditMode
    ? education[index]
    : {
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
    const updatedEducation = education
      ? index !== null
        ? education.map((edu: Education, i: number) =>
            i === index ? data : edu
          )
        : [...education, data]
      : [data];
    setData({
      education: updatedEducation,
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
          <DialogDescription hidden>
            Add / Edit your education history, including your degree, major, and
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
                        <Textarea
                          rows={4}
                          placeholder="Write a short summary about your education"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
