import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFormStore } from "../../store/useFormStore";
import { FormNavigation } from "../layout/FormNavigation";
import { Plus, Trash } from "lucide-react";

const skillSchema = z.object({
  category: z.string().optional(),
  name: z.string().optional(),
});

const formSchema = z.object({
  skills: z.array(skillSchema),
});

// Define categories and initial form data

export const SkillsForm: React.FC = () => {
  const { formData, setData } = useFormStore();
  const initialSkill = formData.skills || { category: "", name: "" };
  const [skillsList, setSkillsList] = useState([{ ...initialSkill }]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { skills: [...skillsList] },
  });

  // Handle form submission
  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Filter out any skills with empty or undefined name or category
    const filteredSkills = values.skills.filter((skill) => skill?.name?.trim());

    // If no skills are left, add an empty skill
    if (filteredSkills.length === 0) {
      filteredSkills.push({ ...initialSkill });
    }
    // Update skills list and store the cleaned data
    setSkillsList(filteredSkills);
    setData({ ...formData, skills: filteredSkills });
  }

  // Add new skill category
  const addCategory = () => {
    setSkillsList([...skillsList, { ...initialSkill }]);
  };

  // Remove skill category
  const handleRemoveCategory = (index: number) => {
    // remove the skill at the index
    const filteredSkills = skillsList.filter((_, i) => i !== index);
    setSkillsList(filteredSkills);
    form.setValue("skills", filteredSkills);
  };

  useEffect(() => {
    setSkillsList(formData.skills || [{ ...initialSkill }]);
    form.reset({ skills: formData.skills });
  }, [formData]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Skills</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 grow"
        >
          {skillsList.map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`skills.${index}.category`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Frontend, Backend" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2 flex-1">
                <FormLabel>Skills</FormLabel>
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`skills.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="e.g., JavaScript, Python"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Remove Category List */}
                  {skillsList.length > 1 && (
                    <Button
                      title="Remove Category"
                      variant="ghost"
                      type="button"
                      size="icon"
                      onClick={() => handleRemoveCategory(index)}
                    >
                      <Trash size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="flex">
            <Button
              variant="ghost"
              type="button"
              className="w-[fit-content] font-semibold"
              onClick={addCategory}
            >
              <Plus size={16} />
              Add Category
            </Button>
          </div>

          {/* <FormNavigation /> */}
        </form>
      </Form>
    </div>
  );
};
