import { create } from "zustand";

interface FormStore {
  step: number;
  formData: Record<string, any>;
  nextStep: () => void;
  prevStep: () => void;
  setData: (data: Record<string, any>) => void;
  getStepData: (step: number) => Record<string, any>;
}

// Create a store with zustand
export const useFormStore = create<FormStore>((set, get) => ({
  step: 0,
  formData: {},
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  getStepData: (step) => get().formData[step] || {},
}));
