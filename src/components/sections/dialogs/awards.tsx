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
import { Award } from "../../../types/types";
import { RichTextEditor } from "../../core/RichTextEditor";

// define awards schema
const awardsSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  issuer: z.string().trim().min(1, { message: "Issuer is required" }),
  date: z.string().trim(),
  website: z.literal("").or(z.string().url()),
  summary: z.string().trim(),
});

// Define the form
export const AwardsDialog: React.FC = () => {
  const { isOpen, closeDialog, index } = useDialog();
  const {
    setData,
    resumeData: { awards },
  } = useResume();

  // check if user is in edit mode
  const isEditMode = awards && index !== null && awards[index];

  // define default values for the form
  const defaultValues: Award = isEditMode
    ? awards[index]
    : {
        id: "",
        name: "",
        issuer: "",
        date: "",
        website: "",
        summary: "",
      };

  // define form
  const form = useForm<z.infer<typeof awardsSchema>>({
    resolver: zodResolver(awardsSchema),
    defaultValues,
  });

  // on submit function
  function onSubmit(data: z.infer<typeof awardsSchema>) {
    // Generate unique id if creating
    const dataWithId = isEditMode
      ? { ...data, id: awards[index].id }
      : { ...data, id: crypto.randomUUID() };
    // Update the awards data with the new data
    const updatedAwards = isEditMode
      ? awards.map((award: Award, i: number) =>
          i === index ? dataWithId : award
        )
      : [...awards, dataWithId];
    // set the updated data to the store
    setData({
      awards: updatedAwards,
    });
    closeDialog();
    form.reset();
  }

  useEffect(() => {
    form.reset(defaultValues);
  }, [index, awards]);

  return (
    <Dialog open={isOpen("awards")} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Award" : "Add Award"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edit a award you have received"
              : "Add a award you have received"}
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
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Best Employee of the Year"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issuer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuer</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: ABC Corporation" {...field} />
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
                      <Input placeholder="March 2020" {...field} />
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
                      <Input
                        placeholder="https://example.com/award"
                        {...field}
                      />
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
