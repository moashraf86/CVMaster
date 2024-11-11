import { create } from "zustand";

interface FormStore {
  step: number;
  formData: Record<string, any>;
  nextStep: () => void;
  prevStep: () => void;
  setValue: (key: string, value: any) => void;
  setData: (data: Record<string, any>) => void;
}

// Create a store with zustand
export const useFormStore = create<FormStore>((set) => ({
  step: 0,
  formData: {},
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setValue: (key, value) =>
    set((state) => ({ formData: { ...state.formData, [key]: value } })),
  setData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
}));
