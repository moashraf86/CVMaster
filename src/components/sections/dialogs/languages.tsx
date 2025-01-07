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
import { Language } from "../../../types/types";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../../ui/select";

// define languages schema
const languageSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  level: z.string().min(1, { message: "Level is required" }),
});

// Define the form
export const LanguagesDialog: React.FC = () => {
  const { isOpen, closeDialog, index } = useDialog();
  const {
    setData,
    resumeData: { languages },
  } = useResume();

  // check if user is in edit mode
  const isEditMode = languages && index !== null && languages[index];

  // define default values for the form
  const defaultValues: Language = isEditMode
    ? languages[index]
    : {
        name: "",
        level: "",
      };

  // define form
  const form = useForm<z.infer<typeof languageSchema>>({
    resolver: zodResolver(languageSchema),
    defaultValues,
  });

  // on submit function
  function onSubmit(data: z.infer<typeof languageSchema>) {
    const currentLanguages = languages;
    const updatedLanguages = isEditMode
      ? currentLanguages.map((lang: Language, i: number) =>
          i === index ? data : lang
        )
      : [...currentLanguages, data];
    setData({
      languages: updatedLanguages,
    });
    closeDialog();
    form.reset();
  }

  useEffect(() => {
    form.reset(defaultValues);
  }, [index, languages]);

  return (
    <Dialog open={isOpen("languages")} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Language" : "Add Language"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your language proficiency"
              : "Add your language proficiency"}
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
                      <Input placeholder="Ex: English" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Conversational">
                          Conversational
                        </SelectItem>
                        <SelectItem value="Fluent">Fluent</SelectItem>
                        <SelectItem value="Native or Bilingual">
                          Native or Bilingual
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
