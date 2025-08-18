import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import React, { useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { History, Sparkle } from "lucide-react";
import { useResume, useAnalysis } from "../../../store/useResume";
import { aiReview } from "../../../services/groqService";
import { useNavigate } from "react-router";
import { z } from "zod";
import { toast } from "../../../hooks/use-toast";

// inputs schema for job title and description
const inputsSchema = z.object({
  jobTitle: z.string().min(1),
  jobDescription: z.string().min(1),
});

export const ReviewCvDialog: React.FC<{
  isOpen: boolean;

  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const { resumeData } = useResume();
  const { setAnalysis, setIsAnalyzing, isAnalyzing, currentAnalysis } =
    useAnalysis();
  const resume = JSON.stringify(resumeData);
  const navigate = useNavigate();

  const handleReview = async () => {
    try {
      // validate the inputs
      const validatedInputs = inputsSchema.safeParse({
        jobTitle,
        jobDescription,
      });
      // if the inputs are invalid, show a toast
      if (!validatedInputs.success) {
        toast({
          title: "Invalid inputs",
          description: "Please enter a valid job title and description",
          variant: "destructive",
        });
        return;
      }
      setIsAnalyzing(true);
      const review = await aiReview(resume, jobTitle, jobDescription);
      setAnalysis(review);
      onClose();
      navigate("/review");
    } catch (error) {
      toast({
        title: "Error",
        description: `${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Review Your CV with AI</DialogTitle>
          <DialogDescription>
            Receive an AI-powered evaluation of your CV, including a detailed
            score, in-depth analysis, and personalized recommendations to help
            you stand out.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Enter the job title you are applying for</Label>

            <Input
              required
              type="text"
              placeholder="Enter the job title you are applying for"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Enter the job description and requirements</Label>

            <Textarea
              rows={10}
              placeholder="Enter the job description and requirements to get a more accurate review"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />

            {/* Note */}
            <p className="text-xs text-muted-foreground">
              This review is generated based on the CV you built or imported,
              combined with the job description, to provide a more accurate and
              tailored evaluation.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            {/* View last analysis */}
            {currentAnalysis && Object.keys(currentAnalysis).length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  navigate("/review");
                }}
              >
                <History className="size-4 mr-2" />
                View last Review
              </Button>
            )}

            <Button
              variant="outline"
              className="size-auto border-primary"
              shiny
              type="submit"
              disabled={isAnalyzing}
              onClick={handleReview}
            >
              <Sparkle className="size-4 mr-2 text-primary" />
              <span className="text-primary">AI Review </span>
            </Button>
          </div>
        </div>
        {/* loading state */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="flex flex-col items-center justify-center">
              <svg viewBox="25 25 50 50" className="animate-dash">
                <circle r="20" cy="50" cx="50"></circle>
              </svg>
              <p className="text-lg font-medium text-card-foreground mt-4">
                AI is reviewing your CV...
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
