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
import { useFormStore } from "../../store/useFormStore";
import { useEffect } from "react";

// define form schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  title: z.string().min(1, { message: "Job title is required" }),
  email: z.string().email().optional(),
  linkedin: z.string().url().optional(),
  otherLink: z.string().url().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

export const HeaderForm: React.FC = () => {
  // destructure increment and decrement from usSteps
  const { formData, nextStep, setData } = useFormStore();

  // 1. Define the form using the useForm hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // will get from local storage later
    defaultValues: {
      name: "",
      title: "Frontend Developer",
      phone: " +201234567890",
      email: "moashraf@gmail.com",
      linkedin: "https://www.linkedin.com/in/mohamedashraf",
      otherLink: "https://www.github.com/mohamedashraf",
      location: "",
    },
  });

  // Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // prevent default form submission
    nextStep();
    // set the form data to the store
    setData({ ...formData, ...values });
  }

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // get the form data from the store and set it to the form inputs
    form.reset(formData);
  }, [formData]);

  return (
    <div>
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
                    <Input
                      placeholder="John Doe"
                      {...field}
                      onChange={handleChange}
                    />
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
                    <Input
                      placeholder="Software Developer"
                      {...field}
                      onChange={handleChange}
                    />
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
                    <Input
                      placeholder="+010101010"
                      {...field}
                      onChange={handleChange}
                    />
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
                    <Input
                      placeholder="johndeo@gmail.com"
                      {...field}
                      onChange={handleChange}
                    />
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
                      onChange={handleChange}
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
                    <Input
                      placeholder="johndeo@github.com"
                      {...field}
                      onChange={handleChange}
                    />
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
                    <Input
                      placeholder="Cairo, Egypt"
                      {...field}
                      onChange={handleChange}
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
    </div>
  );
};
