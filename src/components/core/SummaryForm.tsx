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

// define form schema
const formSchema = z.object({
  summary: z.string().min(1),
});

export const SummaryForm: React.FC = () => {
  // 1. Define the form using the useForm hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // will get from local storage later
    defaultValues: {
      summary: "",
    },
  });

  // Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <>
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
                      placeholder="I am a software engineer with 5 years of experience in building web applications. I have a strong understanding of web technologies and have worked with various front-end and back-end frameworks."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className=" self-end">
            Next
          </Button>
        </form>
      </Form>
    </>
  );
};
