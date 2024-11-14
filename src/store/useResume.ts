import { create } from "zustand";
import { ResumeType } from "../types/types";

// Create a store with zustand
export const useResume = create<ResumeType>((set) => ({
  step: 0,
  resumeData: {
    basics: {},
    summary: {},
    experience: [],
    projects: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    awards: [],
    volunteering: [],
  },
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setValue: (key, value) =>
    set((state) => ({ resumeData: { ...state.resumeData, [key]: value } })),
  setData: (data) =>
    set((state) => ({ resumeData: { ...state.resumeData, ...data } })),
}));
