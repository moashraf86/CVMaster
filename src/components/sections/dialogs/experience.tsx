import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DialogDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { useDialog } from "../../../hooks/useDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "../../ui/select";
import { useResume } from "../../../store/useResume";
import { Experience } from "../../../types/types";
import { useEffect } from "react";
import { RichTextEditor } from "../../core/RichTextEditor";

// Define schema
const experienceSchema = z.object({
  name: z.string().trim().min(1, { message: "Company is required" }),
  position: z.string().trim().min(1, { message: "Position is required" }),
  dateRange: z.string().trim().min(1, { message: "Date range is required" }),
  location: z.string().trim(),
  employmentType: z.string().min(1, { message: "Employment Type is required" }),
  website: z.literal("").or(z.string().url()),
  summary: z.string().trim(),
});

export const ExperienceDialog: React.FC = () => {
  const { isOpen, closeDialog, index } = useDialog();
  const {
    setData,
    resumeData: { experience },
  } = useResume();

  //check if experience exists and index is not null
  // const isEditMode = experience && index !== null && experience[index];
  const isEditMode = experience && index !== null && experience[index];
  /**
   * 	Define the default values for the form
   * If the experience exists and the index is not null then get the experience at the index
   * Otherwise, set the default values to an empty object
   */
  const defaultValues: Experience = isEditMode
    ? experience[index]
    : {
        name: "",
        position: "",
        location: "",
        employmentType: "",
        dateRange: "",
        website: "",
        summary: "",
      };

  // Define form
  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues,
  });

  // Handle submit logic
  const onSubmit = (data: z.infer<typeof experienceSchema>) => {
    // update the data in the store
    const currentExperience = experience;
    const updatedExperience = isEditMode
      ? currentExperience.map((exp: Experience, i: number) =>
          i === index ? data : exp
        )
      : [...currentExperience, data];
    setData({ experience: updatedExperience });
    closeDialog();
    form.reset();
  };

  useEffect(() => {
    // Reset the form if the index or experience changes
    form.reset(defaultValues);
  }, [experience, index]);

  return (
    <Dialog open={isOpen("experience")} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edit your professional experience to your resume"
              : "Add your professional experience to your resume"}
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
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Cairo, Egypt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Range</FormLabel>
                    <FormControl>
                      <Input placeholder="Jan 2020 - Present" {...field} />
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
