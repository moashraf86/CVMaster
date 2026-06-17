# CV Master - Agent Skills Reference

## Skill 1: Adding a New Resume Section (End-to-End)

This is the most complex pattern in the codebase. Follow these steps exactly when adding a new section.

### Step 1: Define TypeScript Types

**File:** `src/types/types.ts`

```ts
export interface NewSection {
  id: string;
  name: string;
  description: string;
  date: string;
  // ... other fields specific to your section
}
```

Add to `SectionName` union type:
```ts
export type SectionName =
  | "basics"
  | "summary"
  | "experience"
  // ... existing sections
  | "newSection"; // Add your section
```

Add to `ResumeType` interface:
```ts
export interface ResumeType {
  // ...
  resumeData: {
    // ... existing sections
    newSection: NewSection[];
  };
}
```

### Step 2: Create Zod Schema

**File:** `src/lib/schema.ts`

```ts
const newSectionSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, { message: "Name is required" }),
  description: z.string().trim(),
  date: z.string().trim(),
  // ... other fields with validation
});
```

Add to `cvMasterSchema`:
```ts
export const cvMasterSchema = z.object({
  // ... existing schemas
  newSection: z.array(newSectionSchema),
});
```

### Step 3: Update Store Defaults

**File:** `src/store/useResume.ts`

```ts
const DEFAULT_RESUME_DATA = {
  // ... existing defaults
  newSection: [],
  sectionTitles: {
    // ... existing titles
    newSection: "New Section",
  },
};
```

Add to `sectionOrder` array:
```ts
sectionOrder: [
  "summary",
  "experience",
  // ... existing sections
  "newSection", // Add your section
],
```

### Step 4: Create Dialog Component

**File:** `src/components/sections/dialogs/newSection.tsx`

Follow this exact pattern:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useDialog } from "../../../hooks/useDialog";
import { useResume } from "../../../store/useResume";
import { NewSection } from "../../../types/types";
import { useEffect } from "react";
import { RichTextEditor } from "../../core/RichTextEditor";

const newSectionSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  description: z.string().trim(),
  date: z.string().trim(),
});

export const NewSectionDialog: React.FC = () => {
  const { isOpen, closeDialog, index } = useDialog();
  const {
    setData,
    resumeData: { newSection },
  } = useResume();

  const isEditMode = newSection && index !== null && newSection[index];

  const defaultValues: NewSection = isEditMode
    ? newSection[index]
    : {
        id: "",
        name: "",
        description: "",
        date: "",
      };

  const form = useForm<z.infer<typeof newSectionSchema>>({
    resolver: zodResolver(newSectionSchema),
    defaultValues,
  });

  const onSubmit = (data: z.infer<typeof newSectionSchema>) => {
    const itemWithId = isEditMode
      ? { ...data, id: newSection[index].id }
      : { ...data, id: crypto.randomUUID() };

    const updated = isEditMode
      ? newSection.map((item, i) => (i === index ? itemWithId : item))
      : [...newSection, itemWithId];

    setData({ newSection: updated });
    closeDialog();
    form.reset();
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [newSection, index]);

  return (
    <Dialog open={isOpen("newSection")} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit New Section" : "Add New Section"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edit your new section"
              : "Add a new section to your resume"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* ... other fields */}
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          content={field.value}
                          handleChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" className="flex w-full sm:w-auto ms-auto">
              {isEditMode ? "Save Changes" : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
```

### Step 5: Register Dialog in Provider

**File:** `src/providers/DialogProvider.tsx`

```tsx
import { NewSectionDialog } from "../components/sections/dialogs/newSection";

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  // ... existing code
  return (
    <DialogContext.Provider value={...}>
      {children}
      {/* ... existing dialogs */}
      {isOpen("newSection") && <NewSectionDialog />}
    </DialogContext.Provider>
  );
};
```

### Step 6: Create Preview Component

**File:** `src/components/preview/newSection.tsx`

```tsx
import { useResume } from "../../store/useResume";
import { usePdfSettings } from "../../store/useResume";

export const NewSectionPreview: React.FC = () => {
  const {
    resumeData: { newSection },
  } = useResume();
  const {
    pdfSettings: { verticalSpacing },
  } = usePdfSettings();

  if (!newSection || newSection.length === 0) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-bold border-b border-black pb-1">
        New Section
      </h2>
      <div className="space-y-3">
        {newSection.map((item) => (
          <div key={item.id}>
            <div className="flex justify-between">
              <h3 className="font-semibold">{item.name}</h3>
              <span className="text-sm">{item.date}</span>
            </div>
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
```

### Step 7: Add to Preview Renderer

**File:** `src/components/preview/index.tsx`

```tsx
import { NewSectionPreview } from "./newSection";

export const Page: React.FC<PreviewProps> = ({ mode }) => {
  // ... existing code
  return (
    <div>
      <BasicsPreview />
      {sectionOrder.map((sectionId) => {
        switch (sectionId) {
          // ... existing cases
          case "newSection":
            return <NewSectionPreview key={sectionId} />;
          default:
            return null;
        }
      })}
    </div>
  );
};
```

### Step 8: Add to Form

**File:** `src/components/layout/CvForm.tsx`

```tsx
<SectionBase
  id="newSection"
  name="New Section"
  itemsCount={resumeData.newSection?.length || 0}
/>
```

### Step 9: Add Icon

**File:** `src/components/sections/shared/SectionIcon.tsx`

```tsx
import { NewIcon } from "lucide-react";

export const SectionIcon: React.FC<{ section: SectionName }> = ({ section }) => {
  switch (section) {
    // ... existing cases
    case "newSection":
      return <NewIcon className="size-5" />;
    // ...
  }
};
```

### Step 10: Add to Sidebar Navigation

**File:** `src/components/core/SidebarNavigation.tsx`

```tsx
<li>
  <Button
    title="New Section"
    variant="ghost"
    size="icon"
    className="rounded-full"
    onClick={scrollIntoView("newSection")}
  >
    <SectionIcon section="newSection" />
  </Button>
</li>
```

---

## Skill 2: Groq AI Integration Patterns

### Basic AI Function Structure

**File:** `src/services/groqService.ts`

```ts
export async function aiFunctionName(input: string) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional assistant. Your task is to...",
        },
        {
          role: "user",
          content: `Process the following: ${input}`,
        },
      ],
      model: "llama-3.1-8b-instant", // Choose appropriate model
      temperature: 0.1, // Low for deterministic, high for creative
      max_tokens: 1024,
      top_p: 1,
      stream: false, // Always false in this codebase
      stop: null,
    });

    return response.choices[0]?.message?.content?.trim() || "No response";
  } catch (error) {
    console.error("Error:", error);
    
    // Handle rate limits
    if (error instanceof Error && error.message.includes("Rate limit")) {
      toast({
        title: "Rate limit exceeded",
        description: "Please try again later",
        variant: "destructive",
      });
    }
    
    return "No response";
  }
}
```

### JSON Response Format (for structured output)

```ts
const response = await groq.chat.completions.create({
  messages: [...],
  model: "openai/gpt-oss-120b", // Better for JSON
  temperature: 1,
  max_tokens: 8096,
  response_format: {
    type: "json_object", // Forces JSON output
  },
});

const content = response.choices[0]?.message?.content?.trim();
const parsed = JSON.parse(content);
```

### Vision API (for images)

```ts
const completion = await groq.chat.completions.create({
  messages: [
    {
      role: "system",
      content: "You are an image analysis assistant...",
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Analyze this image and extract...",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`,
          },
        },
      ],
    },
  ],
  model: "meta-llama/llama-4-scout-17b-16e-instruct", // Multimodal model
  temperature: 1,
  max_tokens: 8096,
});
```

### Cleaning AI Responses

```ts
function cleanAIResponse(content: string): string {
  // Remove markdown code blocks
  let cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "");

  // Extract JSON object
  const firstBrace = cleaned.indexOf("{");
  if (firstBrace !== -1) {
    cleaned = cleaned.substring(firstBrace);
  }

  const lastBrace = cleaned.lastIndexOf("}");
  if (lastBrace !== -1) {
    cleaned = cleaned.substring(0, lastBrace + 1);
  }

  return cleaned.trim();
}
```

### Error Handling Patterns

```ts
try {
  const result = await aiFunction(input);
  // Process result
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes("Rate limit")) {
      throw new Error("AI Model rate limit reached. Please try again later.");
    } else if (error.message.includes("JSON")) {
      throw new Error("Invalid data format received from AI");
    } else if (error.message.includes("network")) {
      throw new Error("Network error. Please check your connection.");
    }
  }
  throw new Error("AI processing failed. Please try again.");
}
```

---

## Skill 3: PDF Generation Flow

### Client-Side (DownloadCV Component)

**File:** `src/components/core/DownloadCV.tsx`

```tsx
// 1. Create hidden div and render print mode
const div = document.createElement("div");
const root = createRoot(div);
flushSync(() => {
  root.render(<Page mode="print" />);
});

// 2. Build full HTML document
const getHtmlContent = () => {
  return `<html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <link href="${buildFontCssUrl(fontFamily, ["400", "700"])}" rel="stylesheet">
    </head>
    <style>
      :root { --resume-font-family: ${fontFamily}; }
      body { font-family: var(--resume-font-family); }
      ul { list-style-type: disc; padding-left: 2rem; }
      ol { list-style-type: decimal; padding-left: 2rem; }
      a { text-decoration: underline; }
    </style>
    <body>
      ${div.innerHTML}
    </body>
  </html>`;
};

// 3. Send to backend
const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pdf`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    htmlContent: getHtmlContent(),
    name: basics.name,
    title: basics.title,
    margin: pdfSettings.margin,
  }),
});

// 4. Download from Cloudinary URL
const data = await res.json();
const link = document.createElement("a");
link.href = data.url;
link.download = `${basics.name}-${basics.title}.pdf`;
link.click();
```

### Server-Side (Backend)

**File:** `backend/index.js`

```js
app.post("/pdf", async (req, res) => {
  const { htmlContent, name, title, margin } = req.body;

  if (!htmlContent) {
    return res.status(400).json({ message: "HTML content is required" });
  }

  try {
    let browser;

    if (process.env.NODE_ENV === "development") {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    if (process.env.NODE_ENV === "production") {
      browser = await puppeteerCore.launch({
        args: Chromium.args,
        defaultViewport: Chromium.defaultViewport,
        executablePath: await Chromium.executablePath(),
        headless: Chromium.headless,
      });
    }

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "a4",
      printBackground: true,
      margin: {
        top: `${margin.VALUE}px`,
        bottom: `${margin.VALUE}px`,
        left: `${margin.VALUE}px`,
        right: `${margin.VALUE}px`,
      },
    });

    await browser.close();

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "cvs",
          format: "pdf",
          public_id: `${name}_${title}_${uuid}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(pdfBuffer);
    });

    res.json({
      message: "PDF generated successfully",
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
```

---

## Skill 4: Import Flow Patterns

### PDF Import

**File:** `src/hooks/useImportPdf.ts`

```ts
export const useImportPDF = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { setData } = useResume();
  const { setValue } = usePdfSettings();

  // Load PDF.js from CDN
  const loadPDFJS = async () => {
    if (window.pdfjsLib) return window.pdfjsLib;
    
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "...";
        resolve(window.pdfjsLib);
      };
      document.head.appendChild(script);
    });
  };

  // Extract text from PDF
  const extractTextFromPDF = async (file: File) => {
    const pdfjsLib = await loadPDFJS();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map(item => item.str).join(" ");
    }
    
    return { text: fullText.trim(), pageCount: pdf.numPages };
  };

  // Main import function
  const importPDFData = async (file: File) => {
    try {
      validateFile(file); // Check type, size
      setIsImporting(true);
      
      const { text } = await extractTextFromPDF(file);
      setIsProcessing(true);
      
      const structuredData = await generateJSONFromText(text);
      
      setData(structuredData);
      setValue("fontFamily", structuredData.pdfSettings.fontFamily);
      setValue("fontSize", structuredData.pdfSettings.fontSize);
      // ... other settings
      
      toast({ title: "PDF imported successfully!" });
      return true;
    } catch (error) {
      toast({ title: "PDF import failed", description: error.message });
      return false;
    } finally {
      setIsImporting(false);
      setIsProcessing(false);
    }
  };

  return { isImporting, isProcessing, importPDFData };
};
```

### Image Import

**File:** `src/hooks/useImportImage.ts`

```ts
export const useImportImage = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { setData } = useResume();
  const { setValue } = usePdfSettings();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
    });
  };

  const importImageData = async (file: File) => {
    try {
      validateFile(file);
      setIsImporting(true);
      
      const base64Image = await fileToBase64(file);
      const structuredData = await generateJSONFromImage(base64Image, file.type);
      
      setData(structuredData);
      setValue("fontFamily", structuredData.pdfSettings.fontFamily);
      // ... other settings
      
      toast({ title: "Image imported successfully!" });
      return true;
    } catch (error) {
      toast({ title: "Image import failed", description: error.message });
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  return { isImporting, importImageData };
};
```

### JSON Import

**File:** `src/hooks/useImportJson.ts`

```ts
export const useImportJSON = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { setData } = useResume();
  const { setValue } = usePdfSettings();

  const importJSONData = async (validatedData: ValidatedData) => {
    try {
      setIsImporting(true);
      
      setData(validatedData);
      setValue("fontFamily", validatedData.pdfSettings.fontFamily);
      // ... other settings
      
      toast({ title: "File imported successfully" });
      return true;
    } catch (error) {
      toast({ title: "Import failed" });
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  return { isImporting, importJSONData };
};
```

---

## Skill 5: Rich Text Editor with AI Actions

**File:** `src/components/core/RichTextEditor.tsx`

### TipTap Extensions

```ts
const extensions = [
  Document,
  Text,
  Bold,
  Italic,
  Paragraph,
  ListItem,
  BulletList,
  OrderedList,
  History,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
  }),
];
```

### AI Action Buttons

```tsx
const AiActionButtons = ({ content, handleChange, ... }) => {
  const { editor } = useCurrentEditor();

  const handleRewrite = async () => {
    setIsRegenerating(true);
    const regeneratedContent = await improveContent(content);
    editor?.chain().focus().setContent(regeneratedContent).run();
    handleChange(regeneratedContent);
    setIsRegenerating(false);
  };

  const handleFixTypos = async () => {
    setIsFixingTypos(true);
    const fixedContent = await fixTypos(content);
    editor?.chain().focus().setContent(fixedContent).run();
    handleChange(fixedContent);
    setIsFixingTypos(false);
  };

  const handleCustomize = async (prompt: string) => {
    setIsCustomizing(true);
    const customizedContent = await customizeContent(content, prompt);
    editor?.chain().focus().setContent(customizedContent).run();
    handleChange(customizedContent);
    setIsCustomizing(false);
  };

  return (
    <div>
      <Button onClick={handleRewrite} disabled={isRegenerating}>
        Improve Writing
      </Button>
      <Button onClick={handleFixTypos} disabled={isFixingTypos}>
        Fix Typos
      </Button>
      <Select onValueChange={handleCustomize}>
        <SelectTrigger>Customize</SelectTrigger>
        <SelectContent>
          <SelectItem value="shorter">Shorter</SelectItem>
          <SelectItem value="longer">Longer</SelectItem>
          <SelectItem value="formal">More Formal</SelectItem>
          {/* ... */}
        </SelectContent>
      </Select>
    </div>
  );
};
```

---

## Skill 6: Zustand Store Patterns

### Creating a New Store

```ts
import { create } from "zustand";

interface NewStoreType {
  data: DataType;
  isLoading: boolean;
  setData: (data: DataType) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useNewStore = create<NewStoreType>((set) => ({
  data: getLocalStorageData("newKey", defaultValue),
  isLoading: false,
  
  setData: (data) => {
    set({ data });
    localStorage.setItem("newKey", JSON.stringify(data));
  },
  
  setLoading: (isLoading) => set({ isLoading }),
}));
```

### Updating Store with Partial Data

```ts
const { setData } = useResume();

// Update single section
setData({ experience: updatedExperience });

// Update multiple sections
setData({
  experience: updatedExperience,
  education: updatedEducation,
});

// Update nested object
setData({
  basics: {
    ...resumeData.basics,
    alignment: "center",
  },
});
```

### localStorage Migration Pattern

```ts
// Check for missing fields in old data
if (localPdfSetting && localPdfSetting.skillsLayout === undefined) {
  localPdfSetting.skillsLayout = "inline";
  localStorage.setItem("pdfSetting", JSON.stringify(localPdfSetting));
}
```

---

## Skill 7: Form Validation with Zod

### Defining Schemas

```ts
import { z } from "zod";

const experienceSchema = z.object({
  name: z.string().trim().min(1, { message: "Company is required" }),
  position: z.string().trim().min(1, { message: "Position is required" }),
  dateRange: z.string().trim().min(1, { message: "Date range is required" }),
  location: z.string().trim(),
  employmentType: z.string().min(1, { message: "Employment Type is required" }),
  website: z.literal("").or(z.string().url()), // Allow empty or valid URL
  summary: z.string().trim(),
});
```

### Using with react-hook-form

```tsx
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues,
});

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="fieldName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  </Form>
);
```

---

## Skill 8: Responsive Design Patterns

### Mobile Detection

```tsx
import { useWindowSize } from "@uidotdev/usehooks";

const windowSize = useWindowSize();
const isMobile = windowSize.width !== null && windowSize.width < 1024;
```

### Conditional Rendering

```tsx
{isMobile ? (
  <MobileCvTabs />
) : (
  <div className="flex flex-col lg:flex-row">
    <CvForm />
    <Preview />
  </div>
)}
```

### Responsive Classes

```tsx
<div className="
  w-full           // Mobile
  sm:w-1/2         // Tablet
  lg:w-1/3         // Desktop
  xl:w-1/4         // Large desktop
">
  Content
</div>

<div className="
  hidden           // Hidden on mobile
  lg:flex          // Visible on desktop
">
  Desktop only
</div>
```

---

## Skill 9: Toast Notifications

### Basic Usage

```tsx
import { toast } from "@/hooks/use-toast";

// Success
toast({
  title: "Success",
  description: "Operation completed",
  variant: "success",
});

// Error
toast({
  title: "Error",
  description: "Something went wrong",
  variant: "destructive",
});

// Info
toast({
  title: "Processing",
  description: "Please wait...",
  variant: "default",
});
```

### In Async Operations

```tsx
const handleAsyncOperation = async () => {
  try {
    toast({
      title: "Processing...",
      description: "Please wait",
    });
    
    await asyncOperation();
    
    toast({
      title: "Success!",
      description: "Operation completed",
      variant: "success",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
  }
};
```

---

## Skill 10: Drag and Drop with dnd-kit

### Section Reordering

**File:** `src/components/core/DndSections.tsx`

```tsx
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function DndSections() {
  const { sectionOrder, setSectionOrder } = useResume();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as SectionName);
      const newIndex = sectionOrder.indexOf(over.id as SectionName);
      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      setSectionOrder(newOrder);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
        {sectionOrder.map((sectionId) => (
          <SortableItem key={sectionId} id={sectionId}>
            {sectionTitles[sectionId]}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

---

## Quick Reference: Common Imports

```tsx
// Store
import { useResume, usePdfSettings, useAnalysis } from "@/store/useResume";

// Hooks
import { useDialog } from "@/hooks/useDialog";
import { toast } from "@/hooks/use-toast";

// Utils
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Icons
import { IconName } from "lucide-react";

// Types
import { Experience, Project, Education } from "@/types/types";

// Constants
import { PDF_SETTINGS, ATS_FRIENDLY_FONTS } from "@/lib/constants";

// AI Service
import { improveContent, fixTypos, aiReview } from "@/services/groqService";
```
