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
import { Certification } from "../../../types/types";
import { RichTextEditor } from "../../core/RichTextEditor";

// define certifications schema
const certificationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  issuer: z.string().min(1, { message: "Issuer is required" }),
  date: z.string(),
  website: z.literal("").or(z.string().url()),
  summary: z.string(),
});

// Define the form
export const CertificationsDialog: React.FC = () => {
  const { isOpen, closeDialog, index } = useDialog();
  const {
    setData,
    resumeData: { certifications },
  } = useResume();

  // get the data from the local storage
  const localStorageData = JSON.parse(
    localStorage.getItem("resumeData") || "{}"
  );

  // check if user is in edit mode
  const isEditMode =
    (localStorageData.certifications &&
      index !== null &&
      localStorageData.certifications[index]) ||
    (certifications && index !== null && certifications[index]);

  // define default values for the form
  const defaultValues = isEditMode
    ? localStorageData.certifications
      ? localStorageData.certifications[index]
      : certifications[index]
    : {
        name: "",
        issuer: "",
        date: "",
        website: "",
        summary: "",
      };

  // define form
  const form = useForm<z.infer<typeof certificationSchema>>({
    resolver: zodResolver(certificationSchema),
    defaultValues,
  });

  // on submit function
  function onSubmit(data: z.infer<typeof certificationSchema>) {
    const currentCetifications =
      localStorageData.certifications || certifications;
    const updatedCertifications = isEditMode
      ? currentCetifications.map((certification: Certification, i: number) =>
          i === index ? data : certification
        )
      : [...currentCetifications, data];
    setData({
      certifications: updatedCertifications,
    });
    closeDialog();
    form.reset();
    // save the data to the local storage
    localStorage.setItem(
      "resumeData",
      JSON.stringify({
        ...localStorageData,
        certifications: updatedCertifications,
      })
    );
  }

  useEffect(() => {
    form.reset(defaultValues);
  }, [index, certifications]);

  return (
    <Dialog open={isOpen("certifications")} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Certification" : "Add Certification"}
          </DialogTitle>
          <DialogDescription hidden>
            Add / Edit a certification you have received
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
                      <Input placeholder="Ex: Js For Beginners" {...field} />
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
                      <Input placeholder="Ex: Coursera, Udemy" {...field} />
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
                        placeholder="https://coursera.org/courseName/abc123"
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
