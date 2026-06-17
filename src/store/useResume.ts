import { create } from "zustand";
import { Analysis, PdfSettings, ResumeType } from "../types/types";
import { PDF_SETTINGS } from "../lib/constants";

// Default values for resume data
const DEFAULT_RESUME_DATA = {
  basics: {
    name: "John Doe",
    title: "Software Developer",
    email: "youremail@domain.com",
    linkedin: "http://linkedin.com/in/johndoe",
    website: "http://johndoe.com",
    phone: {
      value: "+010101010",
      breakAfter: false,
    },
    location: {
      value: "Cairo, Egypt",
      breakAfter: false,
    },
    customFields: [],
    alignment: "start",
    photo: {
      url: "",
      size: 100,
      borderRadius: 4,
      visible: true,
    },
  },
  summary: {
    sectionTitle: "Summary",
    content: "",
  },
  experience: [],
  projects: [],
  education: [],
  skills: [],
  languages: [],
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
  fontSize: 14, // 14px
  fontFamily: "Work Sans",
  fontCategory: "ATS-Friendly",
  scale: PDF_SETTINGS.SCALE.INITIAL,
  lineHeight: 5, // leading-5 (tailwind)
  verticalSpacing: 1, // space-y-1 (tailwind)
  margin: {
    MIN: PDF_SETTINGS.MARGIN.MIN,
    MAX: PDF_SETTINGS.MARGIN.MAX,
    INITIAL: PDF_SETTINGS.MARGIN.INITIAL,
    VALUE: PDF_SETTINGS.MARGIN.VALUE,
    STEP: PDF_SETTINGS.MARGIN.STEP,
  },
  pageBreakLine: true, // show page break in preview mode
  skillsLayout: "inline",
};

// Helper function to safely parse JSON from localStorage
const getLocalStorageData = (key: string, defaultValue = null) => {
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
const localHiddenItemIds =
  (getLocalStorageData("hiddenItemIds") as { hiddenItemIds?: string[] })
    ?.hiddenItemIds ?? [];

// Create resume store
export const useResume = create<ResumeType>((set, get) => ({
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
  hiddenItemIds: localHiddenItemIds,
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
  toggleHiddenItem: (id) => {
    const current = get().hiddenItemIds;
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    set({ hiddenItemIds: next });
    localStorage.setItem(
      "hiddenItemIds",
      JSON.stringify({ hiddenItemIds: next })
    );
  },
}));

// Migration: ensure old users' pdfSetting includes skillsLayout
if (localPdfSetting && localPdfSetting.skillsLayout === undefined) {
  // If skillsLayout is missing, add it and save back
  localPdfSetting.skillsLayout = "inline";
  localStorage.setItem("pdfSetting", JSON.stringify(localPdfSetting));
}

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

// Create review store
export const useAnalysis = create<{
  currentAnalysis: Analysis | null;
  isAnalyzing: boolean;
  error: string | null;
  setAnalysis: (analysis: Analysis) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  clearAnalysis: () => void;
  setError: (error: string | null) => void;
}>((set) => ({
  currentAnalysis: getLocalStorageData("currentAnalysis", null),
  isAnalyzing: false,
  error: null,

  setAnalysis: (analysis) => {
    localStorage.setItem("currentAnalysis", JSON.stringify(analysis));
    set({ currentAnalysis: analysis });
  },

  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

  clearAnalysis: () => {
    localStorage.removeItem("currentAnalysis");
    set({ currentAnalysis: null });
  },

  setError: (error) => set({ error }),
}));
