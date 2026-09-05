import { describe, it, expect, beforeEach } from "vitest";
import { useResume, usePdfSettings, useAnalysis } from "../useResume";
import type { SectionName, Analysis } from "../../types/types";

describe("useResume", () => {
  beforeEach(() => {
    useResume.setState({
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
      hiddenItemIds: [],
      resumeData: useResume.getState().resumeData,
    });
    localStorage.clear();
  });

  it("has default section order", () => {
    const { sectionOrder } = useResume.getState();
    expect(sectionOrder).toEqual([
      "summary",
      "experience",
      "projects",
      "education",
      "skills",
      "languages",
      "certifications",
      "awards",
      "volunteering",
    ]);
  });

  it("setData merges partial data and syncs to localStorage", () => {
    const { setData, resumeData } = useResume.getState();

    setData({ basics: { ...resumeData.basics, name: "Jane Doe" } });

    const updated = useResume.getState();
    expect(updated.resumeData.basics.name).toBe("Jane Doe");

    const stored = JSON.parse(localStorage.getItem("resumeData") || "{}");
    expect(stored.basics.name).toBe("Jane Doe");
    expect(stored.basics.title).toBe(resumeData.basics.title);
  });

  it("setSectionOrder updates order and syncs to localStorage", () => {
    const { setSectionOrder } = useResume.getState();
    const newOrder = ["experience", "summary", "skills"];

    setSectionOrder(newOrder as SectionName[]);

    expect(useResume.getState().sectionOrder).toEqual(newOrder);

    const stored = JSON.parse(localStorage.getItem("sectionOrder") || "{}");
    expect(stored.sectionOrder).toEqual(newOrder);
  });

  it("toggleHiddenItem adds and removes items", () => {
    const { toggleHiddenItem } = useResume.getState();

    toggleHiddenItem("item-1");
    expect(useResume.getState().hiddenItemIds).toContain("item-1");

    toggleHiddenItem("item-1");
    expect(useResume.getState().hiddenItemIds).not.toContain("item-1");
  });

  it("setHiddenItemIds replaces all hidden items", () => {
    const { setHiddenItemIds, toggleHiddenItem } = useResume.getState();

    toggleHiddenItem("item-1");
    setHiddenItemIds(["item-2", "item-3"]);

    const state = useResume.getState();
    expect(state.hiddenItemIds).toEqual(["item-2", "item-3"]);

    const stored = JSON.parse(localStorage.getItem("hiddenItemIds") || "{}");
    expect(stored.hiddenItemIds).toEqual(["item-2", "item-3"]);
  });
});

describe("usePdfSettings", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("has default font family", () => {
    const { pdfSettings } = usePdfSettings.getState();
    expect(pdfSettings.fontFamily).toBe("Work Sans");
  });

  it("setValue updates a single setting and syncs to localStorage", () => {
    const { setValue } = usePdfSettings.getState();

    setValue("fontSize", 16);

    expect(usePdfSettings.getState().pdfSettings.fontSize).toBe(16);

    const stored = JSON.parse(localStorage.getItem("pdfSetting") || "{}");
    expect(stored.fontSize).toBe(16);
  });

  it("preserves other settings when updating one", () => {
    const { setValue, pdfSettings } = usePdfSettings.getState();
    const originalFont = pdfSettings.fontFamily;

    setValue("fontSize", 18);

    expect(usePdfSettings.getState().pdfSettings.fontFamily).toBe(originalFont);
  });
});

describe("useAnalysis", () => {
  beforeEach(() => {
    useAnalysis.setState({
      currentAnalysis: null,
      isAnalyzing: false,
      error: null,
    });
    localStorage.clear();
  });

  it("starts with no analysis", () => {
    const { currentAnalysis, isAnalyzing, error } = useAnalysis.getState();
    expect(currentAnalysis).toBeNull();
    expect(isAnalyzing).toBe(false);
    expect(error).toBeNull();
  });

  it("setAnalysis stores analysis and syncs to localStorage", () => {
    const { setAnalysis } = useAnalysis.getState();
    const analysis: Analysis = {
      overallScore: 85,
      jobFitPercentage: 85,
      isResume: true,
      summary: {
        strengths: ["Strong experience"],
        weaknesses: ["Missing skills section"],
        fitLevel: "Good fit",
      },
      detailedAnalysis: {
        contentAlignment: {
          score: 80,
          feedback: "Good alignment",
          matchingSkills: ["React"],
          missingSkills: ["TypeScript"],
        },
        experienceRelevance: {
          score: 85,
          feedback: "Relevant experience",
          relevantExperience: ["Frontend dev"],
          experienceGaps: ["Backend"],
        },
        resumeStructure: {
          score: 75,
          feedback: "Needs improvement",
          sectionsToImprove: [
            { sectionName: "Skills", improvement: "Add more" },
          ],
        },
        atsCompatibility: {
          score: 90,
          feedback: "ATS friendly",
          missingKeywords: ["CI/CD"],
        },
      },
      recommendations: {
        highPriority: ["Add TypeScript"],
        mediumPriority: ["Update summary"],
        lowPriority: ["Add projects"],
      },
      specificImprovements: {
        professionalSummary: "Make it more concise",
        skillsSection: "Add TypeScript",
        experienceSection: "Add metrics",
        educationSection: "Add GPA",
        additionalSections: "Add certifications",
      },
      nextSteps: ["Update skills"],
      estimatedImprovementTime: "30 min",
    };

    setAnalysis(analysis);

    expect(useAnalysis.getState().currentAnalysis).toEqual(analysis);

    const stored = JSON.parse(localStorage.getItem("currentAnalysis") || "null");
    expect(stored).toEqual(analysis);
  });

  it("clearAnalysis removes analysis from state and localStorage", () => {
    const { setAnalysis, clearAnalysis } = useAnalysis.getState();
    setAnalysis({} as Partial<Analysis> as Analysis);

    clearAnalysis();

    expect(useAnalysis.getState().currentAnalysis).toBeNull();
    expect(localStorage.getItem("currentAnalysis")).toBeNull();
  });

  it("setIsAnalyzing updates loading state", () => {
    const { setIsAnalyzing } = useAnalysis.getState();

    setIsAnalyzing(true);
    expect(useAnalysis.getState().isAnalyzing).toBe(true);

    setIsAnalyzing(false);
    expect(useAnalysis.getState().isAnalyzing).toBe(false);
  });

  it("setError updates error state", () => {
    const { setError } = useAnalysis.getState();

    setError("Something went wrong");
    expect(useAnalysis.getState().error).toBe("Something went wrong");

    setError(null);
    expect(useAnalysis.getState().error).toBeNull();
  });
});
