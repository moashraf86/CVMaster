import { useEffect, useState } from "react";
import { z } from "zod";
import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useFormStore } from "../../store/useFormStore";

// Define a type for the experience
type Experience = {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
};

// Define a default experience form
const experienceForm: Experience = {
  companyName: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
};

// Define the validation schema using zod
const experienceSchema = z.object({
  companyName: z.string().min(1, { message: "Company Name is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  startDate: z.string().min(1, { message: "Start Date is required" }),
  endDate: z.string().min(1, { message: "End Date is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

const formSchema = z.object({
  experience: z.array(experienceSchema),
});

export const ExperienceForm: React.FC = () => {
  const { formData, setData, prevStep, nextStep } = useFormStore();
  const [experienceList, setExperienceList] = useState<Experience[]>([
    formData.experience || experienceForm,
  ]);
  const [errors, setErrors] = useState<{
    [key: number]: { [key: string]: string };
  }>({});

  // Define a submit handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // validate the form data using the schema
    const result = formSchema.safeParse({ experience: experienceList });
    if (!result.success) {
      const fieldErrors: { [key: number]: { [key: string]: string } } = {};
      result.error.issues.map((issue) => {
        const path = issue.path;
        const index = path[1];
        const fieldName = path[2];
        if (!fieldErrors[index as number]) fieldErrors[index as number] = {};
        fieldErrors[index as number][fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setData({ ...formData, experience: experienceList });
    // nextStep();
  };

  // handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedExperienceList = experienceList.map((experience, i) => {
      // check if the index matches the current index
      if (i === index) {
        return { ...experience, [e.target.name]: e.target.value };
      }
      return experience;
    });
    setExperienceList(updatedExperienceList);

    // clear the error message when the user starts typing
    if (errors[index] && errors[index][e.target.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index][e.target.name];
        return newErrors;
      });
    }
  };

  useEffect(() => {
    console.log(formData);
    console.log(errors);

    // get the form data from the store and set it to the form inputs
    // form.reset(formData);
  }, [formData, errors]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Personal Info</h2>
      <form onSubmit={handleSubmit}>
        {experienceList.map((experience, index) => (
          <div
            key={index}
            className={cn(
              "space-y-4 pb-6",
              index > 0 && "pt-4 border-t border-border"
            )}
          >
            {/* Company & position */}
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor={`companyName${index}`}>Company Name</Label>
                <Input
                  type="text"
                  name="companyName"
                  id={`companyName${index}`}
                  placeholder="Company Name"
                  value={experience.companyName}
                  onChange={(e) => handleChange(e, index)}
                />
                {/* Error message goes here */}
                {errors[index] && errors[index].companyName && (
                  <p className="text-xs text-destructive">
                    {errors[index].companyName}
                  </p>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor={`position${index}`}>Position</Label>
                <Input
                  type="text"
                  name="position"
                  placeholder="Position"
                  value={experience.position}
                  onChange={(e) => handleChange(e, index)}
                />
                {/* Error message goes here */}
                {errors[index] && errors[index].position && (
                  <p className="text-xs text-destructive">
                    {errors[index].position}
                  </p>
                )}
              </div>
            </div>
            {/* Start & end Date */}
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor={`startDate${index}`}>Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  value={experience.startDate}
                  onChange={(e) => handleChange(e, index)}
                />
                {/* Error message goes here */}
                {errors[index] && errors[index].startDate && (
                  <p className="text-xs text-destructive">
                    {errors[index].startDate}
                  </p>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor={`endDate${index}`}>End Date</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={experience.endDate}
                  onChange={(e) => handleChange(e, index)}
                />
                {/* Error message goes here */}
                {errors[index] && errors[index].endDate && (
                  <p className="text-xs text-destructive">
                    {errors[index].endDate}
                  </p>
                )}
              </div>
            </div>
            {/* Description */}
            <div className="space-y-2 flex-1">
              <Label htmlFor={`description${index}`}>Description</Label>
              <Textarea
                rows={5}
                name="description"
                placeholder="Description"
                value={experience.description}
                onChange={(e) => handleChange(e, index)}
              />
              {/* Error message goes here */}
              {errors[index] && errors[index].description && (
                <p className="text-xs text-destructive">
                  {errors[index].description}
                </p>
              )}
            </div>
            {/* add / Remove experience */}
            <div className="flex">
              <Button
                variant="outline"
                type="button"
                className="flex me-auto hover:text-destructive hover:border-destructive"
                onClick={() =>
                  setExperienceList(
                    experienceList.filter((exp, i) => i !== index)
                  )
                }
              >
                Remove
              </Button>
              {index === experienceList.length - 1 && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() =>
                    setExperienceList([...experienceList, experienceForm])
                  }
                >
                  + Add Experience
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
    </div>
  );
};
