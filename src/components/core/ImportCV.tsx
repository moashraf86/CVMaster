import React, { useState } from "react";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";
import { ImportCvDialog } from "./dialogs/ImportCvDialog";

export const ImportCV: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        title="Import your CV"
        onClick={() => setIsOpen(true)}
      >
        Import
        <Upload />
      </Button>
      <ImportCvDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
