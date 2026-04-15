import { useState } from "react";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import { ReviewCvDialog } from "./dialogs/ReviewCvDialog";
import { useWindowSize } from "@uidotdev/usehooks";

export const ReviewBtn: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const windowSize = useWindowSize();
  const isMobile = windowSize.width && windowSize.width < 768;
  return (
    <>
      <Button
        variant="outline"
        className="size-auto border-primary"
        shiny={!isMobile}
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="size-4 text-primary" />

        <span className="text-primary">AI Review</span>
      </Button>

      <ReviewCvDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
