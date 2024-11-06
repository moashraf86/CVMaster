import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useFormStore } from "../../store/useFormStore";
import { useEffect } from "react";
import { Summary } from "../../types/types";

//define default form data
const summaryForm: Summary = {
  summary:
    "I am a software engineer with 5 years of experience in building web applications. I have a strong understanding of web technologies and have worked with various front-end and back-end frameworks.",
};

// define form schema
const formSchema = z.object({
  summary: z.string().min(1, { message: "Summary is required" }),
});

export const SummaryForm: React.FC = () => {
  const { formData, prevStep, nextStep, setData } = useFormStore();
  // 1. Define the form using the useForm hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // will get from local storage later
    defaultValues: {
      ...summaryForm,
    },
  });

  // Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // set the form data to the store
    setData({ ...formData, ...values });
    nextStep();
  }

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // setData({ ...formData, [e.target.name]: e.target.value });
    // increase the height of the textarea as the user types
    e.currentTarget.style.height = "auto";
    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
  };

  useEffect(() => {
    // get the form data from the store and set it to the form inputs
    form.reset(formData);
  }, [formData]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Summary</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="I am a software engineer with 5 years of experience in building web applications. I have a strong understanding of web technologies and have worked with various front-end and back-end frameworks."
                      {...field}
                      onInput={handleChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between">
            <Button type="button" onClick={prevStep}>
              Prev
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
