import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
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
import { Plus, Trash } from "lucide-react";
import { FormNavigation } from "../layout/FormNavigation";

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
  skills: z.array(z.string().optional()).optional(),
});

const formSchema = z.object({
  projects: z.array(projectSchema),
});

export const ProjectsForm: React.FC = () => {
  const { formData, setData, nextStep } = useFormStore();
  const initialProjectsList = formData.projects || projectsForm;
  const [projectsList, setProjectsList] = useState([
    { ...initialProjectsList },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projects: [...projectsList],
    },
  });

  // Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Remove empty skills and ensure each project has at least one empty skill
    const filteredProjects = values.projects.map((project) => {
      // filter out empty skills
      const filteredSkills = (project.skills || []).filter(
        (skill) => skill && skill.trim() !== ""
      );
      // return the project with the filtered skills
      return {
        ...project,
        skills: filteredSkills.length ? filteredSkills : [""],
      };
    });

    // set the form data to the store
    setData({ ...formData, projects: filteredProjects });
    // move to the next step
    nextStep();
  }

  // handle add project
  const handleAddProject = () => {
    setProjectsList([...projectsList, projectsForm]);
  };

  // handle remove project
  const handleRemoveProject = (index: number) => {
    const newProjectsList = projectsList.filter((_, i) => i !== index);
    setProjectsList(newProjectsList);
    form.setValue(`projects`, newProjectsList);
  };

  // handle remove skill
  const handleRemoveSkill = (projectIndex: number, skillIndex: number) => {
    const newProjectsList = projectsList.map((project, index) => {
      if (index === projectIndex) {
        return {
          ...project,
          skills: project.skills.filter(
            (_: string, i: number) => i !== skillIndex
          ),
        };
      }
      return project;
    });

    setProjectsList(newProjectsList);
    form.reset({ projects: newProjectsList });
  };

  // handle add skill
  const handleAddSkill = (projectIndex: number) => {
    const newProjectsList = projectsList.map((project, index) => {
      if (index === projectIndex) {
        return {
          ...project,
          skills: [...project.skills, ""],
        };
      }
      return project;
    });

    setProjectsList(newProjectsList);
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

  useEffect(() => {
    setProjectsList(formData.projects || [projectsForm]);
    form.reset({ projects: formData.projects || [projectsForm] });
  }, [formData]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 grow"
        >
          {projectsList.map((project: Project, index: number) => (
            <>
              <div
                key={index}
                className="flex flex-col gap-4 border border-border p-4 rounded-lg"
              >
                <div className="flex">
                  <h3 className="text-lg font-bold italic">
                    Project {index + 1}
                  </h3>
                  {projectsList.length > 1 && (
                    <Button
                      title="Delete Project"
                      variant="ghost"
                      size="icon"
                      type="button"
                      className="ms-auto text-destructive border-destructive hover:text-primary-foreground hover:bg-destructive"
                      onClick={() => handleRemoveProject(index)}
                    >
                      <Trash size={16} />
                    </Button>
                  )}
                </div>
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
                  {project?.skills?.map((skill: string, skillIndex: number) => (
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
                      {project.skills.length > 1 && (
                        <Button
                          title="Remove Skill"
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSkill(index, skillIndex)}
                        >
                          <Trash size={16} />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    variant="ghost"
                    className="w-[fit-content] font-semibold"
                    type="button"
                    onClick={() => handleAddSkill(index)}
                  >
                    <Plus size={16} />
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
              </div>
              <div className="flex justify-between">
                {/* add/remove experience list */}
                {projectsList.length - 1 === index && (
                  <Button
                    variant="ghost"
                    type="button"
                    className="font-semibold "
                    onClick={() => {
                      handleAddProject();
                    }}
                  >
                    <Plus size={16} />
                    Add Project
                  </Button>
                )}
              </div>
            </>
          ))}
          <FormNavigation />
        </form>
      </Form>
    </div>
  );
};
