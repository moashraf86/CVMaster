// [1] Define type for PersonInfo
export interface Basics {
  name: string;
  title: string;
  email: string;
  linkedin: string;
  website: string;
  phone: string;
  location: string;
}

// [2] Define type for summary
export interface Summary {
  sectionTitle: string;
  content: string;
}

// [3] Define type for Experience
export interface Experience {
  name: string;
  position: string;
  dateRange: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Freelance" | "Internship" | "";
  website: string;
  summary: string;
}

export interface Project {
  name: string;
  description: string;
  date: string;
  website: string;
  summary: string;
  keyword: string;
  keywords: string[];
}

export interface Education {
  name: string;
  degree: string;
  studyField: string;
  date: string;
  website: string;
  summary: string;
}

export interface Skill {
  name: string | undefined;
  keyword: string | undefined;
  keywords: string[];
}

export interface Language {
  name: string;
  level: string;
}

interface BaseAchievement {
  name: string;
  date: string;
  issuer: string;
  website: string;
  summary: string;
}

export type Certification = BaseAchievement;
export type Award = BaseAchievement;

export interface Volunteering {
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
  [key: string]: string | string[];
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
  };
  setData: (data: Record<string, unknown>) => void;
  setSectionOrder: (order: SectionName[]) => void;
}

export interface PdfSettings {
  pdfSettings: {
    fontSize: number;
    fontFamily: string;
    scale: number;
    showForm: boolean;
  };
  setValue: (key: string, value: number | string | boolean) => void;
}
