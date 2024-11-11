import { z } from "zod";
import { Input } from "../ui/input";
import { useFormStore } from "../../store/useFormStore";
import { PersonalInfo } from "../../types/types";
import { Label } from "../ui/label";

// schema
const basicsSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.literal("").or(z.string().email()), // empty string or valid email
  linkedin: z.literal("").or(z.string().url()),
  website: z.literal("").or(z.string().url()),
  phone: z.string(),
  location: z.string(),
});

export const HeaderForm: React.FC = () => {
  // destructure increment and decrement from usSteps
  const {
    setValue,
    formData: { basics },
  } = useFormStore();

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("basics", {
      ...basics,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Personal Info</h2>
      <main className="grid gap-4 sm:grid-col-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="basics.name">Full Name</Label>
          <Input
            placeholder="John Doe"
            name="name"
            id="basics.name"
            value={basics?.name}
            onChange={handleChange}
            hasError={
              !basicsSchema
                .pick({ name: true })
                .safeParse({ name: basics.name }).success
            }
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="basics.title">Job Title</Label>
          <Input
            placeholder="Software Developer"
            name="title"
            id="basics.title"
            value={basics?.title}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="basics.email">Email</Label>
          <Input
            placeholder="youremail.com"
            name="email"
            id="basics.email"
            value={basics?.email}
            onChange={handleChange}
            hasError={
              !basicsSchema
                .pick({ email: true })
                .safeParse({ email: basics.email }).success
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="basics.linkedin">LinkedIn</Label>
          <Input
            type="url"
            placeholder="http://linkedin.com/in/johndeo"
            name="linkedin"
            id="basics.linkedin"
            value={basics?.linkedin}
            onChange={handleChange}
            hasError={
              !basicsSchema
                .pick({ linkedin: true })
                .safeParse({ linkedin: basics.linkedin }).success
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="basics.linkedin">Website/Portfolio</Label>
          <Input
            placeholder="http://linkedin.com/in/johndeo"
            name="website"
            id="basics.website"
            value={basics?.website}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="basics.phone">Phone</Label>
          <Input
            placeholder=" +010101010"
            name="phone"
            id="basics.phone"
            value={basics?.phone}
            onChange={handleChange}
            hasError={
              !basicsSchema
                .pick({ phone: true })
                .safeParse({ phone: basics.phone }).success
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="basics.location">Location</Label>
          <Input
            placeholder="Cairo, Egypt"
            name="location"
            id="basics.location"
            value={basics?.location}
            onChange={handleChange}
          />
        </div>
      </main>
    </div>
  );
};
