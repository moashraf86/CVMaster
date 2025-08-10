// [1] Define type for PersonInfo
export interface Basics {
  name: string;
  title: string;
  email: string;
  linkedin: string;
  website: string;
  phone: {
    value: string;
    breakAfter: boolean;
  };
  location: {
    value: string;
    breakAfter: boolean;
  };
  alignment: "start" | "center" | "end";
}

// [2] Define type for summary
export interface Summary {
  sectionTitle: string;
  content: string;
}

// [3] Define type for Experience
export interface Experience {
  id: string;
  name: string;
  position: string;
  dateRange: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Freelance" | "Internship" | "";
  website: string;
  summary: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  date: string;
  website: string;
  summary: string;
  keyword: string;
  keywords: string[];
}

export interface Education {
  id: string;
  name: string;
  degree: string;
  studyField: string;
  date: string;
  website: string;
  summary: string;
}

export interface Skill {
  id: string;
  name: string | undefined;
  keyword: string | undefined;
  keywords: string[];
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

interface BaseAchievement {
  id: string;
  name: string;
  date: string;
  issuer: string;
  website: string;
  summary: string;
}

export type Certification = BaseAchievement;
export type Award = BaseAchievement;

export interface Volunteering {
  id: string;
  name: string;
  position: string;
  date: string;
  location: string;
  summary: string;
}

// define type
export type Section = {
  name: string;
  itemsCount: number;
  id: SectionName;
};

export type SectionItem = {
  [key: string]: string | string[] | undefined | null;
};

export type SectionName =
  | "basics"
  | "summary"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "languages"
  | "certifications"
  | "awards"
  | "volunteering";

// DEfine ResumeData type
export interface ResumeType {
  sectionOrder: SectionName[];
  resumeData: {
    basics: Basics;
    summary: Summary;
    experience: Experience[];
    projects: Project[];
    education: Education[];
    skills: Skill[];
    languages: Language[];
    certifications: Certification[];
    awards: Award[];
    volunteering: Volunteering[];
    sectionTitles: {
      [key in SectionName]: string;
    };
  };
  setData: (data: Record<string, unknown>) => void;
  setSectionOrder: (order: SectionName[]) => void;
}

export interface PdfSettings {
  pdfSettings: {
    fontSize: number;
    fontFamily: string;
    fontsCategory: string;
    scale: number;
    lineHeight: number;
  };
  setValue: (key: string, value: number | string | boolean) => void;
}

// Fonts type
export type FontCategory =
  | "sans-serif"
  | "serif"
  | "display"
  | "handwriting"
  | "monospace";

// Google Fonts API response types
export type GoogleFontAxis = {
  tag: string;
  start: number;
  end: number;
};

export type GoogleFontFiles = {
  [variant: string]: string; // URL to font file
};

export type GoogleFont = {
  kind: "webfonts#webfont";
  family: string;
  category: FontCategory;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: GoogleFontFiles;
  menu?: string;
  axes?: GoogleFontAxis[]; // For variable fonts
};

export type GoogleFontsAPIResponse = {
  kind: "webfonts#webfontList";
  items: GoogleFont[];
};

// App's font info type
export type FontInfo = {
  family: string;
  category: FontCategory;
  variants: string[];
  variable: boolean;
};
