import { z } from "zod";
import { Input } from "../ui/input";
import { useResume } from "../../store/useResume";
import { Label } from "../ui/label";
import {
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartVertical,
  UserRound,
} from "lucide-react";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

// schema
const basicsSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  title: z.string().trim().min(1, { message: "Title is required" }),
  email: z.string().email(), // empty string or valid email
  linkedin: z.literal("").or(z.string().url()),
  website: z.literal("").or(z.string().url()),
  phone: z.object({
    value: z.string(),
    breakAfter: z.boolean(),
  }),
  location: z.object({
    value: z.string(),
    breakAfter: z.boolean(),
  }),
});

export const BasicsInfo: React.FC = () => {
  const {
    setData,
    resumeData: { basics },
  } = useResume();

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      basics: {
        ...basics,
        [e.target.name]:
          e.target.name === "phone"
            ? { ...basics?.phone, value: e.target.value }
            : e.target.name === "location"
            ? { ...basics?.location, value: e.target.value }
            : e.target.value,
      },
    });
  };

  // handle justify content
  const handleJustify = (alignment: "start" | "center" | "end") => {
    setData({
      basics: {
        ...basics,
        alignment,
      },
    });
  };

  return (
    <section
      className="grid gap-y-6"
      id="basics"
      aria-labelledby="basics-title"
    >
      <header className="flex items-center gap-x-4">
        <UserRound />
        <h2 className="text-2xl font-bold" id="basics-title">
          Personal Info
        </h2>
      </header>
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
                .safeParse({ name: basics?.name }).success
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
            hasError={
              !basicsSchema
                .pick({ title: true })
                .safeParse({ title: basics?.title }).success
            }
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
                .safeParse({ email: basics?.email }).success
            }
          />
          {!basicsSchema
            .pick({ email: true })
            .safeParse({ email: basics?.email }).success && (
            <p className="text-xs text-primary/65">
              Use format: name@domain.com
            </p>
          )}
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
                .safeParse({ linkedin: basics?.linkedin }).success
            }
          />
          {!basicsSchema
            .pick({ linkedin: true })
            .safeParse({ linkedin: basics?.linkedin }).success && (
            <p className="text-xs text-primary/65">
              URL must start with: https://
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="basics.linkedin">Portfolio</Label>
          <Input
            placeholder="http://linkedin.com/in/johndeo"
            name="website"
            id="basics.website"
            value={basics?.website}
            onChange={handleChange}
            hasError={
              !basicsSchema
                .pick({ website: true })
                .safeParse({ website: basics?.website }).success
            }
          />
          {!basicsSchema
            .pick({ website: true })
            .safeParse({ website: basics?.website }).success && (
            <p className="text-xs text-primary/65">
              URL must start with: https://
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="basics.phone">Phone</Label>
          <Input
            placeholder=" +010101010"
            name="phone"
            id="basics.phone"
            value={basics?.phone.value}
            onChange={handleChange}
            hasError={
              !basicsSchema
                .pick({ phone: true })
                .safeParse({ phone: basics?.phone }).success
            }
          />
          <div className="flex items-center justify-end gap-x-2">
            <Switch
              title="Break after"
              id="basics.phone.breakAfter"
              checked={basics?.phone.breakAfter}
              disabled={!basics?.phone.value}
              onCheckedChange={(checked: boolean) =>
                setData({
                  basics: {
                    ...basics,
                    phone: { ...basics?.phone, breakAfter: checked },
                  },
                })
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="basics.location">Location</Label>
          <Input
            placeholder="Cairo, Egypt"
            name="location"
            id="basics.location"
            value={basics?.location.value}
            onChange={handleChange}
            hasError={
              !basicsSchema
                .pick({ location: true })
                .safeParse({ location: basics?.location }).success
            }
          />
          <div className="flex items-center justify-end gap-x-2">
            <Switch
              title="Break after"
              id="basics.location.breakAfter"
              checked={basics?.location.breakAfter}
              disabled={!basics?.location.value}
              onCheckedChange={(checked: boolean) =>
                setData({
                  basics: {
                    ...basics,
                    location: { ...basics?.location, breakAfter: checked },
                  },
                })
              }
            />
          </div>
        </div>
        {/* Justify Content controller */}
        <div className="inline-flex  max-w-fit gap-2 col-span-2 py-1.5 px-3 border border-border rounded-md">
          <Button
            title="Justify start"
            type="button"
            variant={basics.alignment === "start" ? "default" : "ghost"}
            className="rounded-sm"
            onClick={() => handleJustify("start")}
          >
            <AlignStartVertical className="!size-5" />
          </Button>
          <Button
            title="Justify center"
            type="button"
            variant={basics.alignment === "center" ? "default" : "ghost"}
            className="rounded-sm"
            onClick={() => handleJustify("center")}
          >
            <AlignCenterVertical className="!size-5" />
          </Button>
          <Button
            title="Justify end"
            type="button"
            variant={basics.alignment === "end" ? "default" : "ghost"}
            className="rounded-sm"
            onClick={() => handleJustify("end")}
          >
            <AlignEndVertical className="!size-5" />
          </Button>
        </div>
      </main>
    </section>
  );
};
