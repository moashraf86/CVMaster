import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useFormStore } from "../../store/useFormStore";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Experience } from "../../types/types";

// Define a default experience form
const experienceForm: Experience = {
  companyName: "",
  title: "",
  employmentType: "",
  location: "",
  locationType: "",
  currentlyWorking: false,
  startDate: new Date(),
  endDate: undefined,
  description:
    "• Collaborated with designers to translate design mockups and user stories into functional and responsive web pages \n • Ensured cross-browser compatibility and responsiveness across various devices for an optimal user experience. \n • Utilized Storybook to showcase component variations, interactions, and usage examples, facilitating collaboration and maintainability.",
};

// Define the validation schema using zod
const experienceSchema = z
  .object({
    companyName: z.string().min(1, { message: "Company Name is required" }),
    title: z.string().min(1, { message: "Position is required" }),
    employmentType: z
      .string()
      .min(1, { message: "Employment Type is required" }),
    location: z.string().optional(),
    locationType: z.string().optional(),
    currentlyWorking: z.boolean().optional(),
    startDate: z.date({
      required_error: "Start Date is required",
    }),
    endDate: z.date().optional(),
    description: z.string().min(1, { message: "Description is required" }),
  })
  .refine(
    (data) => {
      // `endDate` is required only if `currentlyWorking` is false
      // const startDate = ctx.parent?.startDate;
      if (!data.currentlyWorking && !data.endDate) {
        return false; // Return false if `endDate` is required
      }
      if (data.endDate && data.startDate && data.endDate < data.startDate) {
        return false;
      }
      return true;
    },
    {
      path: ["endDate"], // Specify path to `endDate` field for error message location
      message: "End Date is required",
    }
  );

const formSchema = z.object({
  experience: z.array(experienceSchema),
});

export const ExperienceForm: React.FC = () => {
  const { formData, setData, prevStep, nextStep } = useFormStore();
  const experienceList = formData.experience || [experienceForm];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experience: [...experienceList],
    },
  });

  // Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // add experience list to the store
    setData({
      ...formData,
      experience: [...experienceList, experienceForm],
    });
    // set the form data to the store
    setData({ ...formData, experience: values.experience });
    nextStep();
  }

  // handle bullet points
  const handleBulletPoints = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    field: ControllerRenderProps<any>
  ) => {
    const { value, selectionStart } = e.target as HTMLTextAreaElement;
    // add bullet point to the text area if it's empty
    if (value === "") {
      field.onChange("• ");
      e.preventDefault();
    }

    if (e.key === "Enter") {
      e.preventDefault();
      // add bullet point to the text area if it's empty

      // Insert a new line with a bullet point
      const newValue =
        value.substring(0, selectionStart) +
        "\n• " +
        value.substring(selectionStart);

      // Use React Hook Form's setValue to update the field value
      field.onChange(newValue);

      // Move the cursor to the correct title
      setTimeout(() => {
        (e.target as HTMLTextAreaElement).setSelectionRange(
          selectionStart + 3,
          selectionStart + 3
        );
      }, 0);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Experience</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Map via exp list */}
          {experienceList.map((_: Experience, index: number) => (
            <div key={index} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name={`experience.${index}.companyName`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experience.${index}.title`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                  name={`experience.${index}.employmentType`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
              </div>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name={`experience.${index}.location`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="San Francisco, CA"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experience.${index}.locationType`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Location Type</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="On-site">On-site</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Checkbox */}
              <FormField
                control={form.control}
                name={`experience.${index}.currentlyWorking`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Currently Working Here</FormLabel>
                      <FormDescription>
                        Check this box if you are currently working at this
                        company.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={() => {
                          field.onChange(!field.value);
                          form.setValue(
                            `experience.${index}.currentlyWorking`,
                            !field.value
                          );
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* Start/end Date */}
              <div className="flex gap-4">
                {/* new date picker */}
                <FormField
                  control={form.control}
                  name={`experience.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name={`experience.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled={form.getValues(
                                `experience.${index}.currentlyWorking`
                              )}
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() ||
                              date < new Date("1900-01-01") ||
                              date <
                                form.getValues(`experience.${index}.startDate`)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name={`experience.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="I am a software engineer with 5 years of experience in building web applications. I have a strong understanding of web technologies and have worked with various front-end and back-end frameworks."
                          {...field}
                          onKeyDown={(e) => handleBulletPoints(e, field)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between">
                {/* add/remove experience list */}
                {experienceList.length - 1 === index && (
                  <Button
                    variant="default"
                    type="button"
                    onClick={() => {
                      setData({
                        ...formData,
                        experience: [...experienceList, experienceForm],
                      });
                    }}
                  >
                    Add Experience
                  </Button>
                )}
                {experienceList.length > 1 && (
                  <Button
                    variant="outline"
                    type="button"
                    className="flex ms-auto text-destructive border-destructive hover:text-primary-foreground hover:border-destructive hover:bg-destructive"
                    onClick={() => {
                      setData({
                        ...formData,
                        experience: experienceList.filter(
                          (_: Experience, i: number) => i !== index
                        ),
                      });
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" type="button" onClick={prevStep}>
              Prev
            </Button>
            <Button type="submit" className="self-end">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
