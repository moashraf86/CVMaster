import { create } from "zustand";
import { PdfSettings, ResumeType } from "../types/types";
import { PDF_SETTINGS } from "../lib/constants";

// Default values for resume data
const DEFAULT_RESUME_DATA = {
  basics: {
    name: "John Doe",
    title: "Software Developer",
    email: "youremail@domain.com",
    linkedin: "http://linkedin.com/in/johndoe",
    website: "http://johndoe.com",
    phone: "+010101010",
    location: "Cairo, Egypt",
  },
  summary: {
    sectionTitle: "Summary",
    content:
      "Software Developer with 5 years of experience in building web applications. I have a strong understanding of web technologies and have worked with various front-end and back-end frameworks.",
  },
  experience: [
    {
      id: "cf10d-4b3e-4b7e-8b7d-5e4b4",
      name: "Google",
      position: "Software Developer",
      dateRange: "Jan 2020 - Present",
      location: "Mountain View, CA",
      employmentType: "Full-time",
      website: "https://google.com",
      summary:
        "<ul><li><p>Collaborated with designers to translate design mockups and user stories into functional and responsive web pages.</p></li> <li><p>Ensured cross-browser compatibility and responsiveness across various devices for an optimal user experience.</p></li> <li><p>Utilized Storybook to showcase component variations, interactions, and usage examples, facilitating collaboration and maintainability.</p></li></ul>",
    },
  ],
  projects: [
    {
      id: "cf10d-4b3e-4b7e-78bh-3e4b4",
      name: "Project Name",
      description: "Project Description",
      date: "Jan 2020 - Present",
      website: "",
      summary:
        "<ul><li><strong>Responsive Front-End Development</strong>: Designed and implemented a fully responsive web application using React, ensuring optimal performance across desktop, tablet, and mobile devices.</li><li><strong>Clean Architecture</strong>: Structured the codebase with reusable components, meaningful variable names, and concise documentation to maintain scalability and ease of collaboration.</li><li><strong>Modern Design Integration</strong>: Accurately translated UI/UX designs into interactive interfaces, focusing on accessibility, layout precision, and smooth user experience.</li></ul>",
      keywords: ["React", "TypeScript", "Tailwind CSS"],
    },
  ],
  education: [
    {
      id: "0f222615-8d85-48df-b731-5012717ae97f",
      name: "University of California, Berkeley",
      degree: "Bachelor of Science",
      studyField: "Electrical Engineering & Computer Sciences",
      date: "2015 - 2019",
      website: "https://berkeley.edu",
      summary:
        "<p>GPA: 4</p> <ul><li><strong>Relevant coursework:</strong> Data Structures, Algorithms, Machine Learning, Computer Networks, Operating Systems.</li></ul>",
    },
  ],
  skills: [
    {
      id: "cf10d4b3-e4b7-e8b7-d5e4-b43e78b3e4b",
      name: "Languages",
      keyword: "",
      keywords: ["JavaScript", "TypeScript", "Python", "Java", "C++"],
    },
  ],
  languages: [
    {
      id: "7c5b8e9d-3f4a-4d2e-b7c1-8f9a6b4e3d2c",
      name: "Arabic",
      level: "Native or Bilingual",
    },
  ],
  certifications: [],
  awards: [],
  volunteering: [],
  sectionTitles: {
    summary: "Summary",
    experience: "Experience",
    projects: "Projects",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    certifications: "Certifications",
    awards: "Awards",
    volunteering: "Volunteering",
  },
};

// Default values for pdf settings
const DEFAULT_PDF_SETTINGS = {
  fontSize: 14,
  fontFamily: "inter",
  scale: PDF_SETTINGS.SCALE.INITIAL,
  lineHeight: 5,
};

// Helper function to safely parse JSON from localStorage
const getLocalStorageData = (key: string, defaultValue = {}) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Get data from localStorage
const localResumeData = getLocalStorageData("resumeData");
const localPdfSetting = getLocalStorageData("pdfSetting");
const localSectionOrder = getLocalStorageData("sectionOrder");

// Create resume store
export const useResume = create<ResumeType>((set) => ({
  sectionOrder: [
    "summary",
    "experience",
    "projects",
    "education",
    "skills",
    "languages",
    "certifications",
    "awards",
    "volunteering",
  ],
  ...localSectionOrder,
  resumeData: {
    ...DEFAULT_RESUME_DATA,
    ...localResumeData,
  },
  setData: (data) => {
    set((state) => {
      const newResumeData = {
        ...state.resumeData,
        ...(data as ResumeType["resumeData"]),
      };
      // Save the complete merged state to localStorage
      localStorage.setItem("resumeData", JSON.stringify(newResumeData));
      return { resumeData: newResumeData };
    });
  },
  setSectionOrder: (order) => {
    set(() => ({ sectionOrder: order }));
    localStorage.setItem(
      "sectionOrder",
      JSON.stringify({ sectionOrder: order })
    );
  },
}));

// Create PDF settings store
export const usePdfSettings = create<PdfSettings>((set) => ({
  pdfSettings: {
    ...DEFAULT_PDF_SETTINGS,
    ...localPdfSetting,
  },
  setValue: (key, value) => {
    set((state) => {
      const newPdfSettings = {
        ...state.pdfSettings,
        [key]: value,
      };
      // Save to localStorage with the complete updated settings
      localStorage.setItem("pdfSetting", JSON.stringify(newPdfSettings));
      return { pdfSettings: newPdfSettings };
    });
  },
}));
