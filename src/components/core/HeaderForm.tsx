import { useEffect } from "react";
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
import { PersonalInfo } from "../../types/types";
import { FormNavigation } from "../layout/FormNavigation";

// define default form data
const personalInfoForm: PersonalInfo = {
  name: "Mohamed Ashraf",
  title: "Frontend Developer",
  email: "moashraf@gmail.com",
  linkedin: "http://linkedin.com/in/mohamedashraf",
  otherLink: " http://github.com/mohamedashraf",
  phone: "+20123456789",
  location: "Cairo, Egypt",
};

// define form schema
const personalInfoSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  title: z.string().min(1, { message: "Job title is required" }),
  email: z.string().email().optional(),
  linkedin: z.string().url().optional(),
  otherLink: z.string().url().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

const formSchema = z.object({
  personalInfo: z.array(personalInfoSchema),
});

export const HeaderForm: React.FC = () => {
  // destructure increment and decrement from usSteps
  const { formData, nextStep, setData } = useFormStore();

  // 1. Define the form using the useForm hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // will get from local storage later
    defaultValues: {
      personalInfo: [personalInfoForm],
    },
  });

  // Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // set the form data to the store
    setData({ ...formData, personalInfo: values.personalInfo });
    nextStep();
  }

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    console.log(form.getValues(), formData);

    // get the form data from the store and set it to the form inputs
    form.reset(formData);
  }, [formData]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Personal Info</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 grow"
        >
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name={`personalInfo.0.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      onInput={handleChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`personalInfo.0.title`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Software Developer"
                      {...field}
                      onInput={handleChange}
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
              name={`personalInfo.0.phone`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+010101010"
                      {...field}
                      onInput={handleChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`personalInfo.0.email`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndeo@gmail.com"
                      {...field}
                      onInput={handleChange}
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
              name={`personalInfo.0.linkedin`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Linkedin/Portfolio</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="http://linkedin.com/in/johndeo"
                      {...field}
                      onInput={handleChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`personalInfo.0.otherLink`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Other link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndeo@github.com"
                      {...field}
                      onInput={handleChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name={`personalInfo.0.location`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Cairo, Egypt"
                      {...field}
                      onInput={handleChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormNavigation />
        </form>
      </Form>
    </div>
  );
};
