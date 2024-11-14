import { createContext } from "react";

// Define the types for the context and props
interface DialogContextType {
  openDialog: (id: string) => void;
  updateDialog: (id: string, index: number) => void;
  closeDialog: () => void;
  isOpen: (id: string) => boolean;
  index: number | null;
}

// Create the context with a default value
export const DialogContext = createContext<DialogContextType>({
  openDialog: () => {},
  closeDialog: () => {},
  updateDialog: () => {},
  isOpen: () => false,
  index: null,
});
