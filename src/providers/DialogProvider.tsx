import React, { useState, ReactNode } from "react";
import { ExperienceDialog } from "../components/sections/dialogs/experience";
import { DialogContext } from "../contexts/DialogContext";
import { ProjectsDialog } from "../components/sections/dialogs/projects";
import { EducationDialog } from "../components/sections/dialogs/education";
import { SkillsDialog } from "../components/sections/dialogs/skills";
import { LanguagesDialog } from "../components/sections/dialogs/languages";
import { CertificationsDialog } from "../components/sections/dialogs/certifications";
import { AwardsDialog } from "../components/sections/dialogs/awards";
import { VolunteeringDialog } from "../components/sections/dialogs/volunteering";

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [dialogIndex, setDialogIndex] = useState<number | null>(null);

  const openDialog = (id: string) => setOpenDialogId(id);

  const closeDialog = () => {
    setOpenDialogId(null);
    setDialogIndex(null);
  };

  const updateDialog = (id: string, index: number) => {
    setOpenDialogId(id);
    setDialogIndex(index);
  };

  const isOpen = (id: string) => openDialogId === id;

  return (
    <DialogContext.Provider
      value={{
        openDialog,
        closeDialog,
        updateDialog,
        isOpen,
        index: dialogIndex,
      }}
    >
      {children}
      {isOpen("experience") && <ExperienceDialog />}
      {isOpen("projects") && <ProjectsDialog />}
      {isOpen("education") && <EducationDialog />}
      {isOpen("skills") && <SkillsDialog />}
      {isOpen("languages") && <LanguagesDialog />}
      {isOpen("certifications") && <CertificationsDialog />}
      {isOpen("awards") && <AwardsDialog />}
      {isOpen("volunteering") && <VolunteeringDialog />}
    </DialogContext.Provider>
  );
};
