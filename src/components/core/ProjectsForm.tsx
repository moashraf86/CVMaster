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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Project } from "../../types/types";

// Define a default experience form
const projectsForm: Project = {
  title: "",
  description: "",
  link: "",
  skills: [""],
};

// Define the validation schema using zod
const projectSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  link: z.string().url().optional(),
  skills: z.array(z.string()).optional(),
});

const formSchema = z.object({
  projects: z.array(projectSchema),
});

export const ProjectsForm: React.FC = () => {
  const { formData, setData, prevStep, nextStep } = useFormStore();
  const projectsList = formData.projects || [projectsForm];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projects: [...projectsList],
    },
  });

  // Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // add experience list to the store
    setData({
      ...formData,
      projects: [...projectsList, projectsForm],
    });
    // set the form data to the store
    setData({ ...formData, projects: values.projects });
    nextStep();
  }

  // handle remove skill
  const handleRemoveSkill = (projectIndex: number, skillIndex: number) => {
    const newSkills = projectsList[projectIndex].skills.filter(
      (_: string, index: number) => index !== skillIndex
    );
    form.setValue(`projects.${projectIndex}.skills`, newSkills);
    setData({
      ...formData,
      projects: projectsList.map((project: Project, index: number) => {
        if (index === projectIndex) {
          return {
            ...project,
            skills: newSkills,
          };
        }
        return;
      }),
    });
  };

  // handle add skill
  const handleAddSkill = (projectIndex: number) => {
    const newSkills = [
      ...(form.getValues(`projects.${projectIndex}.skills`) || []),
      "",
    ];
    form.setValue(`projects.${projectIndex}.skills`, newSkills);
    setData({
      ...formData,
      projects: projectsList.map((project: Project, index: number) => {
        if (index === projectIndex) {
          return {
            ...project,
            skills: newSkills,
          };
        }
        return project;
      }),
    });
  };

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
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {projectsList.map((_: Project, index: number) => (
            <div key={index} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name={`projects.${index}.title`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`projects.${index}.link`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input placeholder="Software Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Skills */}
              <div className="flex flex-col gap-2">
                <FormLabel>Skills</FormLabel>
                {projectsList[index].skills.map(
                  (_: string[], skillIndex: number) => (
                    <div key={skillIndex} className="flex gap-2 items-center">
                      <FormField
                        control={form.control}
                        name={`projects.${index}.skills.${skillIndex}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Add skill" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {/* only render after skills is more than 1 */}
                      {projectsList[index].skills.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleRemoveSkill(index, skillIndex)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  )
                )}
                <Button
                  variant="outline"
                  className="w-[fit-content]"
                  type="button"
                  onClick={() => handleAddSkill(index)}
                >
                  Add Skill
                </Button>
                <FormMessage />
              </div>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name={`projects.${index}.description`}
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
                {projectsList.length - 1 === index && (
                  <Button
                    variant="default"
                    type="button"
                    onClick={() => {
                      setData({
                        ...formData,
                        projects: [...projectsList, projectsForm],
                      });
                    }}
                  >
                    Add Project
                  </Button>
                )}
                {projectsList.length > 1 && (
                  <Button
                    variant="outline"
                    type="button"
                    className="flex ms-auto text-destructive border-destructive hover:text-primary-foreground hover:border-destructive hover:bg-destructive"
                    onClick={() => {
                      setData({
                        ...formData,
                        projects: projectsList.filter(
                          (_: Project, i: number) => i !== index
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
