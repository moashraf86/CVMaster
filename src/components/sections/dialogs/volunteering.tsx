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
import { useResume } from "../../../store/useResume";
import { Volunteering } from "../../../types/types";
import { useEffect } from "react";

// Define schema
const volunteeringSchema = z.object({
  name: z.string().min(1, { message: "Organization is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  date: z.string(),
  location: z.string(),
  summary: z.string(),
});

export const VolunteeringDialog: React.FC = () => {
  const { isOpen, closeDialog, index } = useDialog();
  const {
    setData,
    resumeData: { volunteering },
  } = useResume();

  //check if volunteering exists and index is not null
  const isEditMode = volunteering && index !== null && volunteering[index];
  /**
   * 	Define the default values for the form
   * If the volunteering exists and the index is not null then get the volunteering at the index
   * Otherwise, set the default values to an empty object
   */
  const defaultValues = isEditMode
    ? volunteering[index]
    : {
        name: "",
        position: "",
        date: "",
        location: "",
        summary: "",
      };

  // Define form
  const form = useForm<z.infer<typeof volunteeringSchema>>({
    resolver: zodResolver(volunteeringSchema),
    defaultValues,
  });

  // Handle submit logic
  const onSubmit = (data: z.infer<typeof volunteeringSchema>) => {
    // update the data in the store
    const updatedVolunteering = volunteering
      ? index !== null
        ? volunteering.map((vol: Volunteering, i: number) =>
            i === index ? data : vol
          )
        : [...volunteering, data]
      : [data];

    setData({
      volunteering: updatedVolunteering,
    });
    closeDialog();
    form.reset();
  };

  useEffect(() => {
    // Reset the form if the index or volunteering changes
    form.reset(defaultValues);
  }, [volunteering, index]);

  return (
    <Dialog open={isOpen("volunteering")} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Volunteering" : "Add Volunteering"}
          </DialogTitle>
          <DialogDescription hidden>
            Add / Edit a volunteering experience you have participated in
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
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Local Community Center"
                        {...field}
                      />
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
                      <Input
                        placeholder="Ex: Volunteer Coordinate"
                        {...field}
                      />
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
                    <FormLabel>Date or Date Range</FormLabel>
                    <FormControl>
                      <Input placeholder="Mar 2024 - Jun 2024" {...field} />
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