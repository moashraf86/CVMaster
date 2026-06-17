# CV Master - Agent Guide

## Project Overview

CV Master is an AI-powered resume builder that helps users create professional resumes with intelligent suggestions, PDF export, and ATS-friendly formatting.

### Tech Stack

**Frontend (Root `/`):**
- React 18 + TypeScript + Vite
- Zustand (state management)
- Shadcn UI + Radix UI (component library)
- Tailwind CSS (styling)
- Groq SDK (AI integration - client-side)
- TipTap (rich text editor)
- dnd-kit (drag and drop)
- react-hook-form + Zod (forms and validation)
- react-router (routing)
- react-zoom-pan-pinch (preview zoom)

**Backend (`/backend/`):**
- Node.js + Express (plain JavaScript, not TypeScript)
- Puppeteer + @sparticuz/chromium (PDF generation)
- Cloudinary (file storage for PDFs and profile photos)
- express-rate-limit (rate limiting)

**Deployment:**
- Vercel (both frontend and backend)

## Architecture Summary

### Project Structure

This is **not** a monorepo. It's two separate packages:
- `/` - Frontend (React + Vite)
- `/backend/` - Backend (Express API)

No monorepo tooling (no Turborepo, Nx, or workspaces).

### State Management

Three Zustand stores in `src/store/useResume.ts`:

1. **`useResume`** - Main resume data
   - `resumeData`: All CV sections (basics, summary, experience, etc.)
   - `sectionOrder`: Array defining section display order
   - `setData()`: Updates resume data and syncs to localStorage
   - `setSectionOrder()`: Updates section order and syncs to localStorage

2. **`usePdfSettings`** - PDF/rendering settings
   - `pdfSettings`: Font, spacing, margins, scale, etc.
   - `setValue()`: Updates individual settings and syncs to localStorage

3. **`useAnalysis`** - AI review results
   - `currentAnalysis`: Last AI review result
   - `isAnalyzing`: Loading state
   - `setAnalysis()`, `clearAnalysis()`, `setError()`

**localStorage Keys:**
- `resumeData` - Resume content
- `pdfSetting` - PDF settings (note: singular "Setting")
- `sectionOrder` - Section display order
- `currentAnalysis` - Last AI review

### Dialog System

Context/Provider pattern:
- `DialogContext` (`src/contexts/DialogContext.tsx`) - Context definition
- `DialogProvider` (`src/providers/DialogProvider.tsx`) - Provider with state management
- `useDialog` hook (`src/hooks/useDialog.tsx`) - Consumer hook

Dialogs are rendered conditionally in `DialogProvider` based on `openDialogId`.

### AI Integration

All AI calls happen **client-side** via Groq SDK in `src/services/groqService.ts`:

- `improveContent()` - Rewrite/improve text (model: `llama-3.1-8b-instant`)
- `fixTypos()` - Fix spelling/grammar (model: `llama-3.1-8b-instant`)
- `customizeContent()` - Customize tone/length (model: `llama-3.1-8b-instant`)
- `generateJSONFromText()` - Parse PDF text to JSON (model: `openai/gpt-oss-120b`)
- `generateJSONFromImage()` - Parse image to JSON (model: `meta-llama/llama-4-scout-17b-16e-instruct`)
- `aiReview()` - Comprehensive CV review (model: `openai/gpt-oss-120b`)

### Data Flow

**Import PDF:**
1. User uploads PDF → `useImportPDF` hook
2. PDF.js extracts text (client-side)
3. Text sent to Groq → `generateJSONFromText()`
4. AI returns structured JSON
5. Store updated via `setData()` and `setValue()`

**Import Image:**
1. User uploads image → `useImportImage` hook
2. Image converted to base64
3. Base64 sent to Groq Vision API → `generateJSONFromImage()`
4. AI returns structured JSON
5. Store updated

**Export PDF:**
1. User clicks download → `DownloadCV` component
2. `<Page mode="print" />` rendered to hidden div
3. HTML extracted and sent to backend `/pdf` endpoint
4. Backend uses Puppeteer to generate PDF
5. PDF uploaded to Cloudinary
6. Download URL returned to client

**AI Review:**
1. User enters job title/description → `ReviewCvDialog`
2. Resume JSON + job info sent to Groq → `aiReview()`
3. AI returns analysis with scores and recommendations
4. Stored in `useAnalysis` store
5. User navigated to `/review` page to view results

## Key Files Map

### Frontend

**Core:**
- `src/App.tsx` - Main app component, routing, layout
- `src/main.tsx` - Entry point, React Router setup
- `src/store/useResume.ts` - All Zustand stores (resume, PDF settings, analysis)
- `src/services/groqService.ts` - All AI/Groq API calls
- `src/types/types.ts` - TypeScript interfaces for all data structures

**Libraries:**
- `src/lib/schema.ts` - Zod schemas for validation
- `src/lib/constants.ts` - PDF settings, fonts, icons
- `src/lib/utils.ts` - `cn()` utility for class names
- `src/lib/googleFonts.ts` - Google Fonts API integration

**Layout:**
- `src/components/layout/CvForm.tsx` - Left panel with form sections
- `src/components/layout/Preview.tsx` - Right panel with zoom/pan preview
- `src/components/layout/Header.tsx` - Top navigation bar

**Sections (Form):**
- `src/components/sections/basics.tsx` - Personal info form
- `src/components/sections/summary.tsx` - Summary form
- `src/components/sections/shared/SectionBase.tsx` - Reusable section wrapper
- `src/components/sections/dialogs/*.tsx` - Dialog forms for each section

**Preview:**
- `src/components/preview/index.tsx` - Main preview renderer (`<Page />`)
- `src/components/preview/basics.tsx` - Personal info preview
- `src/components/preview/*.tsx` - Preview for each section

**Core Components:**
- `src/components/core/DownloadCV.tsx` - PDF/JSON export
- `src/components/core/ImportCV.tsx` - Import dialog trigger
- `src/components/core/RichTextEditor.tsx` - TipTap editor with AI actions
- `src/components/core/Controls.tsx` - Zoom/pan controls
- `src/components/core/ControlsSheet.tsx` - Settings sheet (fonts, spacing, etc.)
- `src/components/core/DndSections.tsx` - Drag-and-drop section reordering
- `src/components/core/ReviewBtn.tsx` - AI review trigger
- `src/components/core/ReviewResult.tsx` - AI review results display

**Hooks:**
- `src/hooks/useImportPdf.ts` - PDF import logic
- `src/hooks/useImportImage.ts` - Image import logic
- `src/hooks/useImportJson.ts` - JSON import logic
- `src/hooks/useValidateJson.ts` - JSON validation
- `src/hooks/useDialog.tsx` - Dialog context consumer
- `src/hooks/use-toast.ts` - Toast notifications

**Providers:**
- `src/providers/ThemeProvider.tsx` - Dark/light theme
- `src/providers/DialogProvider.tsx` - Dialog state management

**UI:**
- `src/components/ui/*.tsx` - Shadcn UI components (auto-generated, don't edit directly)

### Backend

- `backend/index.js` - Express server, all routes
- `backend/package.json` - Backend dependencies
- `backend/vercel.json` - Vercel deployment config

**Routes:**
- `GET /` - Health check
- `POST /pdf` - Generate PDF from HTML (Puppeteer + Cloudinary)
- `POST /upload-photo` - Upload profile photo (Cloudinary, rate-limited)

## Development Guidelines

### Code Style

- **Path aliases**: Use `@/` for `src/` imports (configured in `tsconfig.json` and `vite.config.ts`)
- **Class names**: Use `cn()` utility from `@/lib/utils` to merge Tailwind classes
- **Component exports**: Named exports for components (e.g., `export const Header`)
- **Icons**: Use Lucide React icons, custom icons in `src/components/core/icons/`
- **IDs**: Use `crypto.randomUUID()` for generating unique IDs

### Component Patterns

**Section Dialogs:**
```tsx
// 1. Define Zod schema
const schema = z.object({ ... });

// 2. Use react-hook-form with zodResolver
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues,
});

// 3. Get dialog state from context
const { isOpen, closeDialog, index } = useDialog();

// 4. Get store data and setter
const { setData, resumeData: { sectionName } } = useResume();

// 5. Handle submit
const onSubmit = (data) => {
  const itemWithId = isEditMode
    ? { ...data, id: existingItem.id }
    : { ...data, id: crypto.randomUUID() };
  
  const updated = isEditMode
    ? items.map((item, i) => i === index ? itemWithId : item)
    : [...items, itemWithId];
  
  setData({ sectionName: updated });
  closeDialog();
  form.reset();
};
```

**Preview Components:**
```tsx
// Access store data
const { resumeData: { sectionName } } = useResume();
const { pdfSettings: { ... } } = usePdfSettings();

// Render with Tailwind classes
// Use cn() for conditional classes
```

**Zustand Store Updates:**
```tsx
// Always use the provided actions, never mutate directly
const { setData } = useResume();
setData({ sectionName: newData }); // Correct

// Never do this:
// resumeData.sectionName = newData; // Wrong!
```

### API Route Patterns (Backend)

```js
// Express route with error handling
app.post('/endpoint', async (req, res) => {
  const { data } = req.body;
  
  if (!data) {
    return res.status(400).json({ message: "Data is required" });
  }
  
  try {
    // Process data
    const result = await processData(data);
    res.json({ success: true, result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
```

### Toast Notifications

```tsx
import { toast } from "@/hooks/use-toast";

toast({
  title: "Success",
  description: "Operation completed",
  variant: "default", // or "destructive" or "success"
});
```

## Common Tasks

### Adding a New Resume Section

1. **Define types** in `src/types/types.ts`:
   ```ts
   export interface NewSection {
     id: string;
     name: string;
     // ... other fields
   }
   ```

2. **Add to `ResumeType`** interface in `types.ts`

3. **Create Zod schema** in `src/lib/schema.ts`:
   ```ts
   const newSectionSchema = z.object({ ... });
   ```

4. **Add to store defaults** in `src/store/useResume.ts`:
   ```ts
   const DEFAULT_RESUME_DATA = {
     // ...
     newSection: [],
   };
   ```

5. **Add to `sectionTitles`** in store defaults

6. **Create dialog component** in `src/components/sections/dialogs/newSection.tsx`:
   - Use react-hook-form + Zod
   - Follow existing dialog patterns

7. **Register dialog** in `src/providers/DialogProvider.tsx`:
   ```tsx
   {isOpen("newSection") && <NewSectionDialog />}
   ```

8. **Create preview component** in `src/components/preview/newSection.tsx`

9. **Add to preview renderer** in `src/components/preview/index.tsx`:
   ```tsx
   case "newSection":
     return <NewSectionPreview key={sectionId} />;
   ```

10. **Add to form** in `src/components/layout/CvForm.tsx`:
    ```tsx
    <SectionBase id="newSection" name="New Section" itemsCount={...} />
    ```

11. **Add to section order** in store defaults

12. **Add icon** in `src/components/sections/shared/SectionIcon.tsx`

13. **Add to sidebar** in `src/components/core/SidebarNavigation.tsx`

### Adding a New AI Prompt

1. **Add function** in `src/services/groqService.ts`:
   ```ts
   export async function newAIFunction(input: string) {
     try {
       const response = await groq.chat.completions.create({
         messages: [
           { role: "system", content: "..." },
           { role: "user", content: input },
         ],
         model: "llama-3.1-8b-instant", // or other model
         temperature: 0.1,
         max_tokens: 1024,
         stream: false,
       });
       
       return response.choices[0]?.message?.content?.trim() || "No response";
     } catch (error) {
       console.error(error);
       return "No response";
     }
   }
   ```

2. **Use in component**:
   ```tsx
   const result = await newAIFunction(userInput);
   ```

### Adding a New API Route (Backend)

1. **Add route** in `backend/index.js`:
   ```js
   app.post('/new-endpoint', async (req, res) => {
     // Implementation
   });
   ```

2. **Add rate limiting** if needed:
   ```js
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 10,
   });
   
   app.post('/new-endpoint', limiter, async (req, res) => { ... });
   ```

3. **Update CORS** if new origins needed (currently allows `*`)

### Adding a New Zustand Store Slice

1. **Add to store** in `src/store/useResume.ts`:
   ```ts
   export const useNewStore = create<NewStoreType>((set) => ({
     data: defaultValue,
     setData: (data) => {
       set({ data });
       localStorage.setItem("newKey", JSON.stringify(data));
     },
   }));
   ```

2. **Initialize from localStorage** if needed:
   ```ts
   const localData = getLocalStorageData("newKey");
   ```

## Agent Rules

### Always Do

- Use Shadcn UI primitives from `@/components/ui/` for new UI elements
- Use `cn()` utility for merging Tailwind classes
- Use `crypto.randomUUID()` for generating unique IDs
- Update localStorage when modifying Zustand stores (use provided actions)
- Use react-hook-form + Zod for all form validation
- Use `toast()` for user notifications
- Follow existing component patterns (check similar components first)
- Use path aliases (`@/`) for imports
- Test responsive behavior on mobile (< 1024px) and desktop
- Run `npm run lint` after changes
- Run `npm run build` to verify TypeScript compilation

### Never Do

- Don't directly mutate Zustand store state (always use actions)
- Don't edit files in `src/components/ui/` directly (they're auto-generated by Shadcn)
- Don't use inline styles when Tailwind classes exist
- Don't add comments unless explicitly requested
- Don't use `any` type (use proper TypeScript types)
- Don't break existing localStorage key names (migration logic exists)
- Don't use `console.log` in production code (use proper error handling)
- Don't hardcode API URLs (use environment variables)
- Don't forget to handle loading/error states for async operations
- Don't skip form validation (always use Zod schemas)

### Check Before Making Changes

- Verify the component doesn't already exist in `src/components/`
- Check if a similar pattern exists elsewhere in the codebase
- Ensure TypeScript types are updated if data structures change
- Verify Zod schemas match TypeScript interfaces
- Check if localStorage migration is needed for existing users
- Ensure mobile responsive behavior is maintained
- Verify dark mode compatibility (use CSS variables from `index.css`)

## Environment Variables

### Frontend (`.env` in root)

```bash
VITE_GROQ_API_KEY="your_groq_api_key"
# Required for AI features. Get from https://console.groq.com

VITE_BACKEND_URL="http://localhost:5000"
# Required for PDF export. Backend URL (local or Vercel)

VITE_GOOGLE_FONTS_API_KEY="your_google_fonts_api_key"
# Optional. Used in constants.ts but not documented in .env.example
# Get from https://developers.google.com/fonts/docs/developer_api
```

### Backend (`.env` in `/backend/`)

```bash
CLOUD_NAME="your_cloudinary_cloud_name"
API_KEY="your_cloudinary_api_key"
API_SECRET="your_cloudinary_api_secret"
# Required for PDF and photo storage. Get from https://cloudinary.com

CLIENT_URL="http://localhost:3000"
# Optional. Currently CORS allows all origins (*)

NODE_ENV="development"
# Set to "production" for Vercel deployment (uses puppeteer-core)

PORT=5000
# Optional. Defaults to 5000
```

## Testing and Build

### Frontend

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

**No tests currently exist** for the frontend.

### Backend

```bash
cd backend

# Install dependencies
npm install

# Start development server (http://localhost:5000)
node index.js

# Or with nodemon for auto-reload
npx nodemon index.js
```

**No tests currently exist** for the backend.

### Deployment

Both frontend and backend deploy to Vercel:
- Frontend: Root directory, Vite build
- Backend: `/backend/` directory, `@vercel/node` runtime

See `backend/vercel.json` for backend routing config.

## Additional Notes

### Mobile Responsive Behavior

- `< 1024px`: Mobile layout with tabs (`MobileCvTabs`)
- `>= 1024px`: Desktop layout with side-by-side form and preview
- Sidebar navigation hidden on mobile, visible on desktop
- Header menu becomes dropdown on mobile

### Theme System

- Uses `ThemeProvider` with localStorage persistence
- CSS variables defined in `src/index.css` for light/dark modes
- Access via `useTheme()` hook from `@/providers/ThemeProvider`

### Font System

- Default font: "Work Sans"
- ATS-Friendly fonts: Predefined list in `constants.ts`
- Other fonts: Fetched from Google Fonts API
- Font loading: Dynamic `<link>` tag injection via `loadGoogleFont()`

### PDF Generation

- Client renders `<Page mode="print" />` to hidden div
- HTML extracted and sent to backend
- Backend uses Puppeteer (local) or puppeteer-core + @sparticuz/chromium (production)
- PDF uploaded to Cloudinary, URL returned
- Client triggers download from Cloudinary URL

### Rate Limiting

- Photo upload: 10 requests per 15 minutes per IP
- AI features: Limited by Groq API quotas (handled client-side)
