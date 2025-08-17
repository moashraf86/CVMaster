import { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Target,
  TrendingUp,
  FileText,
  Award,
  User,
  ArrowLeft,
  CirclePlus,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Analysis } from "../../types/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { cn } from "../../lib/utils";
import { useAnalysis } from "../../store/useResume";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

// Score Circle Component
const ScoreCircle = ({
  score,
  size = "large",
}: {
  score: number;
  size?: "large" | "small";
}) => {
  const radius = size === "large" ? 45 : 30;

  const strokeWidth = size === "large" ? 8 : 6;

  const normalizedRadius = radius - strokeWidth * 2;

  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";

    if (score >= 60) return "text-yellow-600";

    return "text-red-600";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={getScoreColor(score)}
        />
      </svg>

      <span
        className={cn(
          "absolute text-xl font-bold",
          getScoreColor(score),
          size === "small" ? "text-sm" : "text-xl"
        )}
      >
        {score}
      </span>
    </div>
  );
};

// Skills List Component
const SkillsList = ({
  skills,
  type = "present",
}: {
  skills: string[];
  type?: "present" | "missing";
}) => {
  const bgColor =
    type === "present"
      ? "bg-green-50 border-green-200"
      : "bg-red-50 border-red-200";

  const textColor = type === "present" ? "text-green-700" : "text-red-700";

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={index}
          className={`px-3 py-1 rounded-full text-sm border ${bgColor} ${textColor}`}
        >
          {skill}
        </span>
      ))}
    </div>
  );
};

// Main Resume Analysis Viewer Component
export const ReviewResult: React.FC = () => {
  const { currentAnalysis } = useAnalysis();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // get fit level color
  const getFitLevelColor = (fitLevel: string) => {
    switch (fitLevel.toLowerCase()) {
      case "excellent":
        return "text-green-600 bg-green-50";

      case "good":
        return "text-blue-600 bg-blue-50";

      case "fair":
        return "text-yellow-600 bg-yellow-50";

      case "poor":
        return "text-red-600 bg-red-50";

      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // if no analysis, show a loading state
  if (!currentAnalysis) {
    return <div>No analysis found</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      {/* Back button */}
      <Button variant="outline" className="mb-4" onClick={() => navigate("/")}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <div className="w-full h-auto bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground p-6">
          <div className="flex flex-col items-start md:items-center justify-between md:flex-row gap-4">
            <div>
              <h1 className="text-primary-foreground text-3xl font-bold flex flex-col md:flex-row items-start md:items-center gap-3">
                <FileText className="w-8 h-8" />
                CV Analysis Report
              </h1>

              <p className="text-primary-foreground mt-2">
                Comprehensive evaluation and improvement recommendations
              </p>
            </div>

            <div className="w-full md:w-auto text-right flex md:flex-col items-center  md:items-end justify-between gap-2">
              <div className="text-sm text-primary-foreground/70">
                Overall Score
              </div>
              <div className="text-4xl font-bold">
                {currentAnalysis?.overallScore}/100
              </div>
            </div>
          </div>
        </div>

        {/* Score Dashboard */}
        <div className="p-4 sm:p-6 border-b border-border bg-card text-card-foreground">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-center">
            <div className="text-center">
              <ScoreCircle score={currentAnalysis?.overallScore || 0} />

              <div className="mt-2">
                <div className="text-lg font-semibold">Overall Score</div>

                <div className="text-sm text-card-foreground/70">
                  General Assessment
                </div>
              </div>
            </div>

            <div className="text-center">
              <ScoreCircle score={currentAnalysis?.jobFitPercentage || 0} />
              <div className="mt-2">
                <div className="text-lg font-semibold text-card-foreground">
                  Job Fit
                </div>
                <div className="text-sm text-card-foreground/70">
                  Role Compatibility
                </div>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <div
                className={`inline-flex items-center justify-center px-4 py-2 text-center rounded-lg font-semibold text-lg ${getFitLevelColor(
                  currentAnalysis?.summary.fitLevel || ""
                )}`}
              >
                {currentAnalysis?.summary.fitLevel || ""}
              </div>
              <div className="text-lg font-semibold text-card-foreground">
                Candidate Level
              </div>
              <div className="text-sm text-card-foreground/70">
                {currentAnalysis?.estimatedImprovementTime || ""}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full justify-start px-4 sm:px-6 h-14 border-b border-border overflow-x-auto overflow-y-hidden scrollbar-hide">
            <TabsTrigger value="overview">
              <Target className="w-4 h-4 me-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="detailed">
              <TrendingUp className="w-4 h-4 me-2" />
              Detailed Analysis
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <Award className="w-4 h-4 me-2" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="improvements">
              <User className="w-4 h-4 me-2" />
              Improvements
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="p-4 sm:p-6">
            <OverviewContent analysis={currentAnalysis} />
          </TabsContent>
          <TabsContent value="detailed" className="p-4 sm:p-6">
            <DetailedAnalysisContent analysis={currentAnalysis} />
          </TabsContent>
          <TabsContent value="recommendations" className="p-4 sm:p-6">
            <RecommendationsContent analysis={currentAnalysis} />
          </TabsContent>
          <TabsContent value="improvements" className="p-4 sm:p-6">
            <ImprovementsContent analysis={currentAnalysis} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm my-8 px-4">
          <p>
            Resume analysis completed • Focus on high-priority items first for
            maximum impact
          </p>
        </div>
      </div>
    </div>
  );
};

// overview content
const OverviewContent = ({ analysis }: { analysis: Analysis | null }) => {
  return (
    <div className="space-y-6">
      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Key Strengths
          </h3>

          <ul className="space-y-2">
            {analysis?.summary.strengths.map(
              (strength: string, index: number) => (
                <li
                  key={index}
                  className="text-green-700 text-sm flex items-start gap-2 ps-2"
                >
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>

                  {strength}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Areas for Improvement
          </h3>

          <ul className="space-y-2">
            {analysis?.summary.weaknesses.map(
              (weakness: string, index: number) => (
                <li
                  key={index}
                  className="text-red-700 text-sm flex items-start gap-2 ps-2"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>

                  {weakness}
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {analysis?.detailedAnalysis.contentAlignment.matchingSkills.length}
          </div>

          <div className="text-sm text-blue-700">Matching Skills</div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {analysis?.detailedAnalysis.contentAlignment.missingSkills.length}
          </div>

          <div className="text-sm text-red-700">Missing Skills</div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {analysis?.recommendations.highPriority.length}
          </div>

          <div className="text-sm text-yellow-700">High Priority Items</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {analysis?.nextSteps.length}
          </div>

          <div className="text-sm text-green-700">Action Items</div>
        </div>
      </div>
    </div>
  );
};

// detailed analysis content
const DetailedAnalysisContent = ({
  analysis,
}: {
  analysis: Analysis | null;
}) => {
  return (
    <Accordion type="single" collapsible className="space-y-6">
      <AccordionItem
        value="content-alignment"
        className="rounded-lg border-0 shadow-sm"
      >
        <AccordionTrigger className="flex items-center gap-2 bg-background text-foreground hover:bg-accent p-4 rounded-lg border border-border data-[state=open]:shadow-none data-[state=open]:border-b-0 data-[state=open]:rounded-b-none hover:no-underline">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 me-2 text-blue-600" />
            <h3 className="text-lg font-semibold">Content Alignment</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-background p-4 rounded-b-lg border border-border">
          <div className="mb-4 flex items-center gap-4">
            <ScoreCircle
              score={analysis?.detailedAnalysis.contentAlignment.score || 0}
              size="small"
            />
            <div className="flex-1">
              <div className="text-lg font-semibold">
                Score: {analysis?.detailedAnalysis.contentAlignment.score}
                /100
              </div>

              <p className="text-foreground text-sm mt-1">
                {analysis?.detailedAnalysis.contentAlignment.feedback}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-3">
                ✓ Matching Skills
              </h4>

              <SkillsList
                skills={
                  analysis?.detailedAnalysis.contentAlignment.matchingSkills ||
                  []
                }
                type="present"
              />
            </div>

            <div>
              <h4 className="font-semibold text-red-800 mb-3">
                ✗ Missing Skills
              </h4>

              <SkillsList
                skills={
                  analysis?.detailedAnalysis.contentAlignment.missingSkills ||
                  []
                }
                type="missing"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="experience-relevance"
        className="rounded-lg border-0 shadow-sm"
      >
        <AccordionTrigger className="flex items-center gap-2 bg-background text-foreground hover:bg-accent p-4 rounded-lg border border-border data-[state=open]:shadow-none data-[state=open]:border-b-0 data-[state=open]:rounded-b-none hover:no-underline">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 me-2 text-blue-600" />
            <h3 className="text-lg font-semibold">Experience Relevance</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-background p-4 rounded-b-lg border border-border">
          <div className="mb-4 flex items-center gap-4">
            <ScoreCircle
              score={analysis?.detailedAnalysis.experienceRelevance.score || 0}
              size="small"
            />
            <div className="flex-1">
              <div className="text-lg font-semibold">
                Score: {analysis?.detailedAnalysis.experienceRelevance.score}
                /100
              </div>

              <p className="text-foreground text-sm mt-1">
                {analysis?.detailedAnalysis.experienceRelevance.feedback}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-3">
                Relevant Experience
              </h4>

              <ul className="space-y-2">
                {analysis?.detailedAnalysis.experienceRelevance.relevantExperience.map(
                  (exp, index) => (
                    <li
                      key={index}
                      className="text-sm text-foreground flex items-start gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />

                      {exp}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-red-800 mb-3">
                Experience Gaps
              </h4>

              <ul className="space-y-2">
                {analysis?.detailedAnalysis.experienceRelevance.experienceGaps.map(
                  (gap, index) => (
                    <li
                      key={index}
                      className="text-sm text-foreground flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />

                      {gap}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="resume-structure"
        className="rounded-lg border-0 shadow-sm"
      >
        <AccordionTrigger className="flex items-center gap-2 bg-background text-foreground hover:bg-accent p-4 rounded-lg border border-border data-[state=open]:shadow-none data-[state=open]:border-b-0 data-[state=open]:rounded-b-none hover:no-underline">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 me-2 text-blue-600" />
            <h3 className="text-lg font-semibold">Resume Structure</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-background p-4 rounded-b-lg border border-border">
          <div className="mb-4 flex items-center gap-4">
            <ScoreCircle
              score={analysis?.detailedAnalysis.resumeStructure.score || 0}
              size="small"
            />

            <div className="flex-1">
              <div className="text-lg font-semibold">
                Score: {analysis?.detailedAnalysis.resumeStructure.score}
                /100
              </div>

              <p className="text-foreground text-sm mt-1">
                {analysis?.detailedAnalysis.resumeStructure.feedback}
              </p>
            </div>
          </div>

          <h4 className="font-semibold text-foreground mb-3">
            Sections to Improve
          </h4>

          <ul className="space-y-2">
            {analysis?.detailedAnalysis.resumeStructure.sectionsToImprove.map(
              (section, index) => (
                <li
                  key={index}
                  className="space-y-3 text-sm text-foreground bg-muted border border-border rounded p-3"
                >
                  <div className="flex items-center gap-2">
                    <CirclePlus className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                    <strong>{section.sectionName}</strong>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {section.improvement}
                  </p>
                </li>
              )
            )}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="ats-compatibility"
        className="rounded-lg border-0 shadow-sm"
      >
        <AccordionTrigger className="flex items-center gap-2 bg-background text-foreground hover:bg-accent p-4 rounded-lg border border-border data-[state=open]:shadow-none data-[state=open]:border-b-0 data-[state=open]:rounded-b-none hover:no-underline">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 me-2 text-blue-600" />
            <h3 className="text-lg font-semibold">ATS Compatibility</h3>
          </div>
        </AccordionTrigger>

        <AccordionContent className="bg-background p-4 rounded-b-lg border border-border">
          <div className="mb-4 flex items-center gap-4">
            <ScoreCircle
              score={analysis?.detailedAnalysis.atsCompatibility.score || 0}
              size="small"
            />

            <div className="flex-1">
              <div className="text-lg font-semibold">
                Score: {analysis?.detailedAnalysis.atsCompatibility.score}
                /100
              </div>

              <p className="text-foreground text-sm mt-1">
                {analysis?.detailedAnalysis.atsCompatibility.feedback}
              </p>
            </div>
          </div>

          <h4 className="font-semibold text-red-800 mb-3">
            ✗ Missing Keywords
          </h4>

          <SkillsList
            skills={
              analysis?.detailedAnalysis.atsCompatibility.missingKeywords || []
            }
            type="missing"
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

// recommendations content
const RecommendationsContent = ({
  analysis,
}: {
  analysis: Analysis | null;
}) => {
  return (
    <div className="space-y-6">
      {/* High Priority */}
      <div className="bg-background border border-red-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-red-800 mb-5 flex items-center gap-2">
          <AlertCircle className="w-6 h-6" />
          High Priority Recommendations
        </h3>

        <div className="space-y-3">
          {analysis?.recommendations.highPriority.map((rec, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-red-50 border border-red-200 rounded p-4"
            >
              <p className="text-red-800">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Medium Priority */}

      <div className="bg-background border border-yellow-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-yellow-800 mb-5 flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Medium Priority Recommendations
        </h3>

        <div className="space-y-3">
          {analysis?.recommendations.mediumPriority.map((rec, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded p-4"
            >
              <p className="text-yellow-800">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Low Priority */}
      <div className="bg-background border border-green-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-5 flex items-center gap-2">
          <CheckCircle className="w-6 h-6" />
          Low Priority Recommendations
        </h3>
        <div className="space-y-3">
          {analysis?.recommendations.lowPriority.map((rec, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-green-50 border border-green-200 rounded p-4"
            >
              <p className="text-green-800">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-5">
          Immediate Next Steps
        </h3>

        <ol className="space-y-4">
          {analysis?.nextSteps.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </span>

              <p className="text-gray-700">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

// improvements content
const ImprovementsContent = ({ analysis }: { analysis: Analysis | null }) => {
  return (
    <div className="space-y-6">
      {Object.entries(analysis?.specificImprovements || {}).map(
        ([section, improvement]) => (
          <div
            key={section}
            className="bg-muted border border-border rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 capitalize">
              {section.replace(/([A-Z])/g, " $1").trim()}
            </h3>

            <div className="bg-background border border-border rounded p-4">
              <ul className="space-y-4">
                {[...improvement].map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Checkbox
                      id={`${section}-${index}`}
                      className="mt-1 peer"
                    />
                    <Label
                      htmlFor={`${section}-${index}`}
                      className="text-sm text-foreground peer-data-[state=checked]:line-through cursor-pointer"
                    >
                      {item}
                    </Label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      )}
    </div>
  );
};
