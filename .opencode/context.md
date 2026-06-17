# CV Master - Persistent Context

## Data Flow Diagrams

### Import PDF Flow
```
User uploads PDF
    ↓
useImportPDF hook validates file (type, size 1KB-20MB)
    ↓
PDF.js extracts text (client-side, loaded from CDN)
    ↓
Text sent to Groq API → generateJSONFromText()
    ↓
Model: openai/gpt-oss-120b (JSON response format)
    ↓
AI returns structured JSON matching cvMasterSchema
    ↓
cleanAIResponse() removes markdown code blocks
    ↓
JSON.parse() validates structure
    ↓
useResume.setData() updates resumeData
    ↓
usePdfSettings.setValue() updates pdfSettings (font, spacing, margins)
    ↓
localStorage synced automatically
```

### Import Image Flow
```
User uploads image (PNG/JPG/JPEG, max 4MB)
    ↓
useImportImage hook validates file
    ↓
FileReader converts to base64
    ↓
Base64 sent to Groq Vision API → generateJSONFromImage()
    ↓
Model: meta-llama/llama-4-scout-17b-16e-instruct (multimodal)
    ↓
AI returns structured JSON
    ↓
validateCVData() checks for meaningful CV content
    ↓
useResume.setData() updates resumeData
    ↓
usePdfSettings.setValue() updates pdfSettings
    ↓
localStorage synced automatically
```

### Export PDF Flow
```
User clicks Download button
    ↓
DownloadCV component creates hidden div
    ↓
createRoot() renders <Page mode="print" /> to div
    ↓
getHtmlContent() wraps div.innerHTML in full HTML document
    ↓
HTML includes Tailwind CSS CDN + Google Fonts link
    ↓
POST to backend /pdf endpoint with { htmlContent, name, title, margin }
    ↓
Backend launches Puppeteer (local) or puppeteer-core + Chromium (prod)
    ↓
page.setContent() + page.pdf() generates A4 PDF
    ↓
PDF buffer uploaded to Cloudinary (folder: "cvs")
    ↓
Cloudinary returns secure_url
    ↓
Client creates <a> element and triggers download
```

### AI Review Flow
```
User clicks "AI Review" button
    ↓
ReviewCvDialog opens, user enters job title + description
    ↓
Zod validates inputs (title min 5 chars, description min 100 chars)
    ↓
useResume.resumeData serialized to JSON string
    ↓
aiReview() sends to Groq API
    ↓
Model: openai/gpt-oss-120b (JSON response format)
    ↓
AI returns Analysis object with scores, recommendations
    ↓
useAnalysis.setAnalysis() stores result
    ↓
useAnalysis.setIsAnalyzing(false)
    ↓
User navigated to /review page
    ↓
ReviewResult component displays analysis in tabs
```

## Groq AI Model Usage Map

| Function | Model | Temperature | Max Tokens | Use Case |
|----------|-------|-------------|------------|----------|
| `improveContent()` | llama-3.1-8b-instant | 0.1 | 1024 | Rewrite text professionally |
| `fixTypos()` | llama-3.1-8b-instant | 0.1 | 1024 | Fix spelling/grammar |
| `customizeContent()` | llama-3.1-8b-instant | 0.1 | 1024 | Adjust tone/length |
| `generateJSONFromText()` | openai/gpt-oss-120b | 1.0 | 8096 | Parse PDF text to JSON |
| `generateJSONFromImage()` | meta-llama/llama-4-scout-17b-16e-instruct | 1.0 | 8096 | Parse image to JSON (vision) |
| `aiReview()` | openai/gpt-oss-120b | 0.5 | 8192 | Comprehensive CV review |

**Model Selection Rationale:**
- `llama-3.1-8b-instant`: Fast, cheap, good for simple text transformations
- `openai/gpt-oss-120b`: Better at structured JSON output, used for parsing and analysis
- `meta-llama/llama-4-scout-17b-16e-instruct`: Multimodal (vision), used for image parsing

## Store Structure Details

### useResume Store
```ts
{
  sectionOrder: SectionName[], // Order sections appear in preview
  resumeData: {
    basics: Basics, // Personal info, photo, alignment
    summary: Summary, // Section title + HTML content
    experience: Experience[], // Work history
    projects: Project[], // Portfolio projects
    education: Education[], // Academic background
    skills: Skill[], // Technical skills with keywords
    languages: Language[], // Language proficiency
    certifications: Certification[], // Professional certs
    awards: Award[], // Achievements
    volunteering: Volunteering[], // Volunteer work
    sectionTitles: { [key in SectionName]: string }, // Custom section names
    pdfSettings: PdfSettings // Rendering settings (embedded in resumeData)
  },
  setData: (data: Partial<resumeData>) => void,
  setSectionOrder: (order: SectionName[]) => void
}
```

### usePdfSettings Store
```ts
{
  pdfSettings: {
    fontSize: number, // 12-18px
    fontFamily: string, // Google Font name
    fontCategory: string, // "ATS-Friendly" | "serif" | "sans-serif" | etc.
    scale: number, // Preview zoom level (0.4-2.0)
    lineHeight: number, // Tailwind leading-* (4-10)
    verticalSpacing: number, // Tailwind space-y-* (1-10)
    margin: { MIN, MAX, VALUE, INITIAL }, // Page margins in px
    pageBreakLine: boolean, // Show dashed line at page break
    skillsLayout: "inline" | "grid-col" | "grid-row" // Skills display mode
  },
  setValue: (key: string, value: any) => void
}
```

### useAnalysis Store
```ts
{
  currentAnalysis: Analysis | null, // Last AI review result
  isAnalyzing: boolean, // Loading state
  error: string | null, // Error message
  setAnalysis: (analysis: Analysis) => void,
  setIsAnalyzing: (isAnalyzing: boolean) => void,
  clearAnalysis: () => void,
  setError: (error: string | null) => void
}
```

## localStorage Key Mapping

| Key | Store | Type | Description |
|-----|-------|------|-------------|
| `resumeData` | useResume | JSON | Full resume data object |
| `pdfSetting` | usePdfSettings | JSON | PDF rendering settings (note: singular) |
| `sectionOrder` | useResume | JSON | `{ sectionOrder: SectionName[] }` |
| `currentAnalysis` | useAnalysis | JSON | Last AI review Analysis object |
| `cv-master-theme` | ThemeProvider | string | "dark" \| "light" \| "system" |
| `hasVisited` | sessionStorage | string | "true" after first visit (for loader) |

## Component Hierarchy

### App Structure
```
<BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/review" element={<ReviewPage />} />
  </Routes>
</BrowserRouter>

<App>
  <ThemeProvider>
    <DialogProvider>
      <Header />
      {isMobile ? <MobileCvTabs /> : (
        <div>
          <CvForm />
          <Preview />
        </div>
      )}
      <Toaster />
      <Analytics />
    </DialogProvider>
  </ThemeProvider>
</App>
```

### CvForm Structure
```
<CvForm>
  <SidebarNavigation />
  <ScrollArea>
    <BasicsInfo />
    <SummaryForm />
    <SectionBase id="experience" />
    <SectionBase id="projects" />
    <SectionBase id="education" />
    <SectionBase id="skills" />
    <SectionBase id="languages" />
    <SectionBase id="certifications" />
    <SectionBase id="awards" />
    <SectionBase id="volunteering" />
  </ScrollArea>
</CvForm>
```

### Preview Structure
```
<Preview>
  <TransformWrapper>
    <TransformComponent>
      <Page mode="preview">
        <BasicsPreview />
        {sectionOrder.map(section => (
          switch(section) {
            case "summary": <SummaryPreview />
            case "experience": <ExperiencePreview />
            // ... other sections
          }
        ))}
      </Page>
    </TransformComponent>
    <Controls />
  </TransformWrapper>
</Preview>
```

### Dialog System
```
<DialogProvider>
  {children}
  {isOpen("experience") && <ExperienceDialog />}
  {isOpen("projects") && <ProjectsDialog />}
  {isOpen("education") && <EducationDialog />}
  {isOpen("skills") && <SkillsDialog />}
  {isOpen("languages") && <LanguagesDialog />}
  {isOpen("certifications") && <CertificationsDialog />}
  {isOpen("awards") && <AwardsDialog />}
  {isOpen("volunteering") && <VolunteeringDialog />}
</DialogProvider>
```

## Key TypeScript Types

### Resume Sections
- `Basics` - Personal info with photo, alignment, custom fields
- `Summary` - Section title + HTML content
- `Experience` - Company, position, dateRange, location, employmentType, website, summary
- `Project` - Name, description, date, website, summary, keywords
- `Education` - Institution, degree, studyField, date, website, summary
- `Skill` - Name + keywords array
- `Language` - Name + level
- `Certification` / `Award` - Name, date, issuer, website, summary
- `Volunteering` - Name, position, date, location, summary

### Analysis (AI Review Result)
```ts
{
  overallScore: number, // 0-100
  jobFitPercentage: number, // 0-100
  summary: {
    strengths: string[],
    weaknesses: string[],
    fitLevel: "Excellent" | "Good" | "Fair" | "Poor"
  },
  detailedAnalysis: {
    contentAlignment: { score, feedback, matchingSkills, missingSkills },
    experienceRelevance: { score, feedback, relevantExperience, experienceGaps },
    resumeStructure: { score, feedback, sectionsToImprove },
    atsCompatibility: { score, feedback, missingKeywords }
  },
  recommendations: { highPriority, mediumPriority, lowPriority },
  specificImprovements: { professionalSummary, skillsSection, ... },
  nextSteps: string[],
  estimatedImprovementTime: string
}
```

## Backend API Details

### POST /pdf
**Request:**
```json
{
  "htmlContent": "<html>...</html>",
  "name": "John Doe",
  "title": "Software Engineer",
  "margin": { "MIN": 10, "MAX": 50, "VALUE": 20, "INITIAL": 20 }
}
```

**Response:**
```json
{
  "message": "PDF generated and uploaded successfully",
  "url": "https://res.cloudinary.com/...",
  "public_id": "cvs/john-doe_software-engineer_09-06-2026_abc123"
}
```

### POST /upload-photo
**Request:**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/..."
}
```

**Rate Limit:** 10 requests per 15 minutes per IP

## Vite Build Configuration

**Manual Chunks:**
- `react-vendor` - React, ReactDOM, React Router
- `forms` - react-hook-form, Zod, @hookform/resolvers
- `state` - Zustand
- `dnd` - @dnd-kit/*
- `radix` - All @radix-ui/* packages
- `tiptap` - All @tiptap/* packages
- `icons` - lucide-react
- `utils` - qs, dotenv, clsx, cva, tailwind-merge, cmdk, @uidotdev/usehooks
- `services` - groq-sdk, @vercel/analytics

**Path Alias:** `@/` → `./src/`

**Plugins:**
- `@vitejs/plugin-react` - React Fast Refresh
- `rollup-plugin-visualizer` - Bundle analysis (opens stats.html)
- `vite-plugin-compression` - Gzip compression for assets > 1KB
