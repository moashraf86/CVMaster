import { z } from "zod";

// Define basic info
const basicsSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.literal("").or(z.string().email()),
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
  alignment: z.enum(["start", "center", "end"]).optional(),
});

// Define summary
const summarySchema = z.object({
  sectionTitle: z.string(),
  content: z.string(),
});

// Experience entry
const experienceItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string(),
  dateRange: z.string(),
  location: z.string(),
  employmentType: z.string(),
  website: z.literal("").or(z.string().url()),
  summary: z.string(),
});

// Project entry
const projectItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  date: z.string(),
  website: z.literal("").or(z.string().url()),
  summary: z.string(),
  keywords: z.array(z.string()),
});

// Education entry
const educationItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  degree: z.string(),
  studyField: z.string(),
  date: z.string(),
  website: z.literal("").or(z.string().url()),
  summary: z.string(),
});

// Skills entry
const skillsItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  keywords: z.array(z.string()).optional(),
});

// Language entry
const languageItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.string(),
});

// Section titles
const sectionTitlesSchema = z.object({
  summary: z.string(),
  experience: z.string(),
  projects: z.string(),
  education: z.string(),
  skills: z.string(),
  languages: z.string(),
  certifications: z.string(),
  awards: z.string(),
  volunteering: z.string(),
});

// PDF Settings schema
const pdfSettingsSchema = z.object({
  fontFamily: z.string(),
  fontSize: z.number(),
  fontCategory: z.enum([
    "serif",
    "sans-serif",
    "monospace",
    "display",
    "handwriting",
    "ATS-Friendly",
  ]),
  lineHeight: z.number(),
  verticalSpacing: z.number(),
});

// Final CV Master schema
export const cvMasterSchema = z.object({
  basics: basicsSchema,
  summary: summarySchema,
  experience: z.array(experienceItemSchema),
  projects: z.array(projectItemSchema),
  education: z.array(educationItemSchema),
  skills: z.array(skillsItemSchema),
  languages: z.array(languageItemSchema),
  certifications: z.array(z.any()), // empty array for now
  awards: z.array(z.any()), // empty array for now
  volunteering: z.array(z.any()), // empty array for now
  sectionTitles: sectionTitlesSchema,
  pdfSettings: pdfSettingsSchema,
});
