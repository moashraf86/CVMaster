import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// define form schema
const formSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  email: z.string().email(),
  linkedin: z.string().url(),
  otherLink: z.string().url(),
  phone: z.string().min(10),
  location: z.string().optional(),
});

export const HeaderForm: React.FC = () => {
  // 1. Define the form using the useForm hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // will get from local storage later
    defaultValues: {
      name: "",
      title: "",
      phone: "",
      email: "",
      linkedin: "",
      otherLink: "",
      location: "",
    },
  });

  // Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Personal Info</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+010101010" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndeo@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Linkedin/Portfolio</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="http://linkedin.com/in/johndeo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otherLink"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Other link</FormLabel>
                  <FormControl>
                    <Input placeholder="johndeo@github.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Cairo, Egypt" {...field} />
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
