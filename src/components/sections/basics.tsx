import { z } from "zod";
import { Input } from "../ui/input";
import { useResume } from "../../store/useResume";
import { Label } from "../ui/label";
import {
  Camera,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  RefreshCcw,
  TrashIcon,
  Upload,
  UserRound,
} from "lucide-react";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { CustomIcon } from "../core/CustomIcon";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ICONS, PDF_SETTINGS } from "../../lib/constants";
import { useRef, useState } from "react";
import { toast } from "../../hooks/use-toast";
import { DeleteConfirmation } from "../core/dialogs/DeleteConfirmation";
import { cn } from "../../lib/utils";

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
  customFields: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      iconName: z.string(),
      value: z.string(),
      breakAfter: z.boolean(),
    }),
  ),
});

export const BasicsInfo: React.FC = () => {
  const {
    setData,
    resumeData: { basics },
  } = useResume();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeletePhotoDialog, setShowDeletePhotoDialog] = useState(false);

  const buildPhotoUpdate = (url: string) => ({
    url,
    size: basics.photo?.size ?? PDF_SETTINGS.PHOTO.SIZE.DEFAULT,
    borderRadius:
      basics.photo?.borderRadius ?? PDF_SETTINGS.PHOTO.RADIUS.DEFAULT,
    visible: true,
  });

  const uploadToCloudinary = async (base64Data: string) => {
    setIsUploading(true);
    try {
      const api = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${api}/upload-photo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Data }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Upload failed");
      }

      const data = await res.json();
      if (data.url) {
        setData({
          basics: {
            ...basics,
            photo: buildPhotoUpdate(data.url),
          },
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to upload photo to cloud",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPG, JPEG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;

      setData({
        basics: {
          ...basics,
          photo: buildPhotoUpdate(base64Data),
        },
      });

      uploadToCloudinary(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUrlChange = (url: string) => {
    const isValidUrl = z.string().url().safeParse(url).success;
    if (!isValidUrl && url !== "") {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with https://",
        variant: "destructive",
      });
      return;
    }

    setData({
      basics: {
        ...basics,
        photo: buildPhotoUpdate(url),
      },
    });
  };

  const handlePhotoSizeChange = (size: number) => {
    const clamped = Math.max(
      PDF_SETTINGS.PHOTO.SIZE.MIN,
      Math.min(PDF_SETTINGS.PHOTO.SIZE.MAX, size),
    );
    setData({
      basics: {
        ...basics,
        photo: {
          url: basics.photo?.url ?? "",
          size: clamped,
          borderRadius:
            basics.photo?.borderRadius ?? PDF_SETTINGS.PHOTO.RADIUS.DEFAULT,
          visible: basics.photo?.visible ?? true,
        },
      },
    });
  };

  const handlePhotoRadiusChange = (borderRadius: number) => {
    const clamped = Math.max(
      PDF_SETTINGS.PHOTO.RADIUS.MIN,
      Math.min(PDF_SETTINGS.PHOTO.RADIUS.MAX, borderRadius),
    );
    setData({
      basics: {
        ...basics,
        photo: {
          url: basics.photo?.url ?? "",
          size: basics.photo?.size ?? PDF_SETTINGS.PHOTO.SIZE.DEFAULT,
          borderRadius: clamped,
          visible: basics.photo?.visible ?? true,
        },
      },
    });
  };

  const handlePhotoSizeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      handlePhotoSizeChange(value);
    }
  };

  const handlePhotoRadiusInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      handlePhotoRadiusChange(value);
    }
  };

  const handleRemovePhoto = () => {
    setData({
      basics: {
        ...basics,
        photo: {
          url: "",
          size: PDF_SETTINGS.PHOTO.SIZE.DEFAULT,
          borderRadius: PDF_SETTINGS.PHOTO.RADIUS.DEFAULT,
          visible: true,
        },
      },
    });
  };

  const handleTogglePhotoVisibility = () => {
    setData({
      basics: {
        ...basics,
        photo: {
          ...basics.photo,
          visible: !basics.photo?.visible,
        },
      },
    });
  };

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

  // handle show custom field
  const handleShowCustomField = () => {
    const newCustomField = {
      id: crypto.randomUUID(),
      name: "",
      iconName: "link",
      value: "",
      breakAfter: false,
    };

    setData({
      basics: {
        ...basics,
        customFields: [...(basics?.customFields || []), newCustomField],
      },
    });
  };

  // handle remove custom field
  const handleRemoveCustomField = (id: string) => {
    setData({
      basics: {
        ...basics,
        customFields: basics?.customFields.filter((f) => f.id !== id),
      },
    });
  };

  // Handle update custom field
  const handleUpdateCustomField = (
    id: string,
    key: "name" | "iconName" | "value" | "breakAfter",
    newValue: string | boolean,
  ) => {
    setData({
      basics: {
        ...basics,
        customFields: basics?.customFields.map((f) =>
          f.id === id ? { ...f, [key]: newValue } : f,
        ),
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
      <main className="grid gap-4 sm:grid-cols-2">
        {/* Photo Section */}
        <div
          className={cn(
            "sm:col-span-2 space-y-4 transition-all",
            basics.photo?.visible === false && "opacity-30 grayscale",
          )}
        >
          <div className="flex items-center gap-4">
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload profile photo"
              className="relative cursor-pointer group overflow-hidden border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30 hover:border-primary/50 transition-colors w-24 aspect-square"
              style={{
                borderRadius: `${basics.photo?.borderRadius}px`,
              }}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              {basics.photo?.url ? (
                <img
                  src={basics.photo.url}
                  alt={`Profile photo of ${basics.name || "user"}`}
                  className="w-full h-full object-cover"
                  style={{
                    borderRadius: `${basics.photo.borderRadius}px`,
                  }}
                />
              ) : (
                <Camera className="size-8 text-muted-foreground" />
              )}
              {isUploading ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="size-6 text-white animate-spin" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="size-5 text-white" />
                </div>
              )}
            </div>
            <Input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handlePhotoUpload}
              disabled={isUploading}
              className="hidden"
              ref={fileInputRef}
            />
            <div className="shrink-0 flex-1 space-y-2">
              <Label htmlFor="basics.photo.url">Or paste image URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="https://example.com/photo.jpg"
                  name="photo.url"
                  id="basics.photo.url"
                  value={basics.photo?.url || ""}
                  onChange={(e) => handlePhotoUrlChange(e.target.value)}
                  disabled={isUploading}
                />
                <div className="shrink flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit"
                    onClick={handleTogglePhotoVisibility}
                    title={basics.photo?.visible ? "Hide" : "Show"}
                  >
                    {basics.photo?.visible ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit text-destructive hover:text-destructive"
                    onClick={() => setShowDeletePhotoDialog(true)}
                    title="Remove"
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {basics.photo?.url && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="basics.photo.size">Size</Label>
                  <Button
                    title="Reset"
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handlePhotoSizeChange(PDF_SETTINGS.PHOTO.SIZE.DEFAULT)
                    }
                  >
                    <RefreshCcw className="size-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    id="basics.photo.size"
                    value={basics.photo.size ?? PDF_SETTINGS.PHOTO.SIZE.DEFAULT}
                    onChange={handlePhotoSizeInputChange}
                    min={PDF_SETTINGS.PHOTO.SIZE.MIN}
                    max={PDF_SETTINGS.PHOTO.SIZE.MAX}
                    className="pr-10 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                    px
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="basics.photo.borderRadius">
                    Border radius
                  </Label>
                  <Button
                    title="Reset"
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handlePhotoRadiusChange(PDF_SETTINGS.PHOTO.RADIUS.DEFAULT)
                    }
                  >
                    <RefreshCcw className="size-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    id="basics.photo.borderRadius"
                    value={
                      basics.photo.borderRadius ??
                      PDF_SETTINGS.PHOTO.RADIUS.DEFAULT
                    }
                    onChange={handlePhotoRadiusInputChange}
                    min={PDF_SETTINGS.PHOTO.RADIUS.MIN}
                    max={PDF_SETTINGS.PHOTO.RADIUS.MAX}
                    className="pr-10 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                    px
                  </span>
                </div>
              </div>
            </div>
          )}
          <hr className="my-4" />
        </div>

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
            <p className="text-xs text-muted-foreground/70">
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
            <p className="text-xs text-muted-foreground/70">
              URL must start with: https://
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="basics.website">Portfolio</Label>
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
            <p className="text-xs text-muted-foreground/70">
              URL must start with: https://
            </p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="basics.phone">Phone</Label>
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
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="basics.location">Location</Label>
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
        </div>
        {/* CONDITIONALLY RENDER CUSTOM FIELDS */}
        {basics?.customFields.map((field) => (
          <div
            key={field.id}
            className="flex items-center justify-between sm:col-span-2 gap-x-2"
          >
            {/* Icon Name Input */}
            <Popover>
              <Button variant="ghost" size="icon" asChild>
                <PopoverTrigger>
                  <CustomIcon iconName={field.iconName} size={14} />
                </PopoverTrigger>
              </Button>
              <PopoverContent className="w-fit p-2" align="start">
                <div className="flex flex-col gap-2">
                  {/* Icon List */}
                  <div className="grid grid-cols-5 gap-2">
                    {Object.keys(ICONS).map((icon: string) => (
                      <Button
                        title={icon.charAt(0).toUpperCase() + icon.slice(1)}
                        key={icon}
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleUpdateCustomField(field.id, "iconName", icon)
                        }
                      >
                        <CustomIcon iconName={icon} size={16} />
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {/* Name Input */}
            <Input
              type="text"
              placeholder="Name"
              className="flex-1"
              value={field.name}
              onChange={(e) =>
                handleUpdateCustomField(field.id, "name", e.target.value)
              }
            />
            {/* Value Input */}
            <Input
              type="text"
              placeholder="Value"
              className="flex-1"
              value={field.value}
              onChange={(e) =>
                handleUpdateCustomField(field.id, "value", e.target.value)
              }
            />
            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveCustomField(field.id)}
              className="col-span-1"
            >
              <TrashIcon />
            </Button>
          </div>
        ))}
        {/* Add custom fields Button - always at the bottom */}
        <Button
          variant="ghost"
          size="sm"
          className="w-fit col-span-1"
          onClick={handleShowCustomField}
        >
          <Plus />
          Add Custom Field
        </Button>
      </main>
      <DeleteConfirmation
        isOpen={showDeletePhotoDialog}
        setIsOpen={setShowDeletePhotoDialog}
        handleDelete={() => {
          handleRemovePhoto();
          setShowDeletePhotoDialog(false);
        }}
      />
    </section>
  );
};
