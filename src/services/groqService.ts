import Groq from "groq-sdk";
import { toast } from "../hooks/use-toast";
import {
  ResumeType,
  Experience,
  Education,
  Project,
  Skill,
  Analysis,
} from "../types/types";

const MODELS = [
  "openai/gpt-oss-120b",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

// CV schema
const CV_SCHEMA = JSON.stringify({
  basics: {
    name: "",
    title: "",
    email: "",
    linkedin: "",
    website: "",
    phone: { value: "", breakAfter: false },
    location: { value: "", breakAfter: true },
    customFields: [],
    alignment: "start",
  },
  summary: { sectionTitle: "Summary", content: "" },
  experience: [
    {
      id: "",
      name: "",
      position: "",
      dateRange: "",
      location: "",
      employmentType: "",
      website: "",
      summary: "",
    },
  ],
  projects: [
    {
      id: "",
      name: "",
      description: "",
      date: "",
      website: "",
      summary: "",
      keywords: [],
    },
  ],
  education: [
    {
      id: "",
      name: "",
      degree: "",
      studyField: "",
      date: "",
      website: "",
      summary: "",
    },
  ],
  skills: [{ id: "", name: "", keywords: [] }],
  languages: [{ id: "", name: "", level: "" }],
  certifications: [
    { id: "", name: "", date: "", issuer: "", website: "", summary: "" },
  ],
  awards: [
    { id: "", name: "", date: "", issuer: "", website: "", summary: "" },
  ],
  volunteering: [
    { id: "", name: "", position: "", date: "", location: "", summary: "" },
  ],
  sectionTitles: {
    summary: "Summary",
    experience: "Experience",
    projects: "Projects",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    certifications: "Certifications",
    awards: "Awards",
    volunteering: "Volunteering",
  },
  pdfSettings: {
    fontFamily: "Work Sans",
    fontSize: 14,
    fontCategory: "ATS-Friendly",
    lineHeight: 5,
    scale: 0.65,
    verticalSpacing: 2,
    pageBreakLine: true,
    skillsLayout: "inline",
    margin: { MIN: 10, MAX: 50, VALUE: 20, INITIAL: 20 },
  },
});

const JSON_TEXT_SYSTEM_PROMPT = `You are an expert CV/Resume parser. Extract information from CV text and return it as valid JSON only.

RULES:
- Return ONLY valid JSON, no markdown, no extra text
- Never use null bytes, control characters, or special Unicode
- For dates always use regular hyphen: "Jul 2023 - Present"
- Convert ALL bullet points (•, -, *) to <ul><li>item</li></ul>
- Convert ALL numbered lists (1., 2., a)) to <ol><li>item</li></ul>
- "description" fields: plain text only, 1-2 sentences, no HTML
- "summary" fields: full HTML formatting, complete content
- Don't repeat the same info across description and summary
- Don't add info not present in the source text
- Generate uuid v4 IDs for each item`;

const JSON_IMAGE_SYSTEM_PROMPT = `You are an expert CV/Resume parser. Extract CV data from images and return ONLY valid JSON.

RULES:
- Return ONLY the JSON object, no markdown, no extra text
- Never use null bytes or special Unicode characters
- Dates must use regular hyphen: "Jul 2023 - Present"
- Convert ALL bullet points (•, -, *) to <ul><li>item</li></ul>
- Convert ALL numbered lists (1., 2.) to <ol><li>item</li></ol>
- "description" fields: plain text only, 1-2 sentences, no HTML
- "summary" fields: full HTML formatting, complete content
- Generate uuid v4 IDs for every item in every section
- Omit sections not present in the CV (languages, certifications, awards, volunteering)
- If no skills listed, infer from experience and projects
- Always include pdfSettings exactly as provided`;

const AI_REVIEW_SYSTEM_PROMPT = `You are an expert resume reviewer with 15+ years in talent acquisition and career development.

SCORING CRITERIA:
- 95-100: Exceptional, immediately interview-ready
- 85-94: Strong candidate, minor improvements needed
- 75-84: Good potential, moderate enhancements needed
- 65-74: Adequate, significant improvements required
- 55-64: Needs development, major restructuring necessary
- Below 55: Poor alignment, fundamental gaps

RULES:
- Base ALL feedback on specific deficiencies found in THIS resume
- Tailor every recommendation to the exact job requirements
- Only include "specificImprovements" sections where actual gaps exist
- Provide actionable, specific guidance — not generic advice
- Return ONLY valid JSON, no extra text, no markdown`;

// Initialize Groq client
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Improve content with AI
export async function improveContent(content: string | object) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional content editor specializing in clear, concise business communication. Your task is to:\n" +
            "1. Enhance the content to be more professional, polished, and impactful\n" +
            "2. Maintain approximately the same length as the original\n" +
            "3. Preserve all HTML tags and structure exactly as they appear\n" +
            "4. Focus on clarity, precision, and professional tone\n" +
            "5. Remove redundancies and unnecessary words\n" +
            "6. Ensure proper business writing conventions\n\n" +
            "Return only the improved content without any explanations or meta-text.",
        },
        {
          role: "user",
          content: `Please improve the following content while preserving all HTML markup. Make it more professional, concise, and impactful:\n\n${content}`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    return response.choices[0]?.message?.content?.trim() || "No response";
  } catch (error) {
    console.log(error);
    return "No response";
  }
}

// Fix typos in content
export async function fixTypos(content: string | object) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Please proofread and correct any spelling, grammar, or punctuation errors in the following content, while preserving all HTML markup: "${content}"`,
        },
        {
          role: "system",
          content:
            "You are a professional proofreader and editor. Your task is to correct spelling, grammar, and punctuation errors while:\n" +
            "1. Preserving all HTML tags and structure exactly as they appear\n" +
            "2. Maintaining the original meaning and tone\n" +
            "3. Only fixing genuine errors - do not rewrite or rephrase correct content\n" +
            "4. Ensuring proper capitalization and spacing\n" +
            "Return only the corrected content without any explanations.",
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    return response.choices[0]?.message?.content?.trim() || "No response";
  } catch (error) {
    console.log(error);
    return "No response";
  }
}

// Customize content with AI
export async function customizeContent(
  content: string | object,
  prompt: string
) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Customize the following content to make it more ${prompt}: "${content}"`,
        },
        {
          role: "system",
          content:
            "You are a professional content editor. Your task is to customize the provided content according to the user's prompt while following these strict guidelines:\n\n" +
            "1. Preserve all HTML tags and structure exactly as they appear\n" +
            "2. Maintain the original content's core message and intent\n" +
            "3. Keep the output exactly the same length as the input, UNLESS the prompt specifically requests to make it shorter or longer\n" +
            "4. Focus on adjusting tone, style, and word choice to match the customization request\n" +
            "5. Ensure the output is clean - no explanations, headers, or additional formatting\n\n" +
            "Return only the modified content.",
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    return response.choices[0]?.message?.content?.trim() || "No response";
  } catch (error) {
    console.log(error);
    return "No response";
  }
}

// Generate JSON from text (text extracted from pdf)
export async function generateJSONFromText(text: string) {
  for (const model of MODELS) {
    try {
      const response = await groq.chat.completions.create({
        model,
        temperature: 1,
        max_tokens: 8096,
        top_p: 0.9,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: JSON_TEXT_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Parse this CV and return ONLY a JSON object matching the schema below.
						...
						${text}

						RETURN THIS STRUCTURE:
						${CV_SCHEMA}`,
          },
        ],
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) throw new Error("No response from AI");

      const cleanedContent = cleanAIResponse(content);

      const parsedJSON = JSON.parse(cleanedContent);
      if (!parsedJSON.basics) parsedJSON.basics = {};
      if (!parsedJSON.pdfSettings) {
        parsedJSON.pdfSettings = {
          fontFamily: "Work Sans",
          fontSize: 14,
          fontCategory: "ATS-Friendly",
          lineHeight: 5,
          scale: 0.65,
          verticalSpacing: 2,
          pageBreakLine: true,
          skillsLayout: "inline",
          margin: { MIN: 10, MAX: 50, VALUE: 20, INITIAL: 20 },
        };
      }

      return parsedJSON;
    } catch (error) {
      if (error instanceof Error) {
        const isRateLimit =
          error.message.includes("rate_limit_exceeded") ||
          error.message.includes("Rate limit") ||
          error.message.includes("Request too large") ||
          error.message.includes("tokens per minute");

        if (isRateLimit) {
          console.warn(`Rate limit hit on model: ${model}. Trying next...`);
          continue; // try next model
        }

        // non-rate-limit error — fail immediately
        toast({
          title: "Failed Extracting Data from PDF",
          description: error.message,
          variant: "destructive",
        });
        return createFallbackStructure();
      }
    }
  }

  // all models exhausted
  toast({
    title: "All AI models are currently busy",
    description: "Please wait a moment and try again.",
    variant: "destructive",
  });
  return createFallbackStructure();
}

// Generate JSON from image (image uploaded by the user)
export const generateJSONFromImage = async (
  base64Image: string,
  mimeType: string
) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 1,
      max_tokens: 8096,
      top_p: 1,
      stream: false,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: JSON_IMAGE_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract this CV image and return ONLY a JSON object matching this exact schema. Do not add, remove, or rename any keys.

								SCHEMA:
								${CV_SCHEMA}

								EXTRACTION RULES:
								- Each experience, project, education, skill, language, certification, award, volunteering entry must have a unique uuid v4 id
								- description: plain text, 1-2 sentences, no HTML
								- summary: full HTML with <b>, <u>, <i>, <ul><li>, <ol><li> as found in the CV
								- If info is missing use empty string "" or empty array []
								- If no data found at all, return {}`,
            },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64Image}` },
            },
          ],
        },
      ],
    });

    const jsonResponse = completion.choices[0]?.message?.content?.trim();
    if (!jsonResponse) throw new Error("No response received from Vision API");

    const parsedData = JSON.parse(jsonResponse);

    validateCVData(parsedData);

    if (!parsedData.pdfSettings) {
      parsedData.pdfSettings = {
        fontFamily: "Work Sans",
        fontSize: 14,
        fontCategory: "ATS-Friendly",
        lineHeight: 5,
        scale: 0.65,
        verticalSpacing: 2,
        pageBreakLine: true,
        skillsLayout: "inline",
        margin: { MIN: 10, MAX: 50, VALUE: 20, INITIAL: 20 },
      };
    }

    return parsedData;
  } catch (error) {
    if (error instanceof Error) {
      const isRateLimit =
        error.message.includes("rate_limit_exceeded") ||
        error.message.includes("Rate limit") ||
        error.message.includes("Request too large") ||
        error.message.includes("tokens per minute") ||
        error.message.includes("quota");

      if (isRateLimit) {
        console.warn(
          `Rate limit hit on model: meta-llama/llama-4-scout-17b-16e-instruct. Trying next...`
        );
        return createFallbackStructure();
      }

      // JSON parse error
      if (error.message.includes("JSON")) {
        toast({
          title: "Vision API returned invalid data format",
          description: "The model returned malformed JSON. Please try again.",
          variant: "destructive",
        });
        throw new Error("Vision API returned invalid data format");
      }

      // Validation error from validateCVData
      if (error.message.includes("meaningful resume data")) {
        toast({
          title: "Could not detect a valid CV",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Network error
      if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      }

      throw new Error(error.message);
    }
  }
};

// Clean AI response to extract valid JSON
function cleanAIResponse(content: string): string {
  // Remove markdown code blocks
  let cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "");

  // Remove any text before the first opening brace
  const firstBrace = cleaned.indexOf("{");
  if (firstBrace !== -1) {
    cleaned = cleaned.substring(firstBrace);
  }

  // Remove any text after the last closing brace
  const lastBrace = cleaned.lastIndexOf("}");
  if (lastBrace !== -1) {
    cleaned = cleaned.substring(0, lastBrace + 1);
  }

  // Remove "content" prefix if it exists at the beginning
  cleaned = cleaned.replace(/^content\s*/i, "");

  // Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

// Fallback structure when AI fails
function createFallbackStructure() {
  return {
    basics: {
      name: "",
      title: "",
      email: "",
      linkedin: "",
      website: "",
      phone: {
        value: "",
        breakAfter: false,
      },
      location: {
        value: "",
        breakAfter: true,
      },
      customFields: [],
      alignment: "start",
    },
    summary: {
      sectionTitle: "Summary",
      content: "",
    },
    experience: [],
    projects: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    awards: [],
    volunteering: [],
    sectionTitles: {
      summary: "Summary",
      experience: "Experience",
      projects: "Projects",
      education: "Education",
      skills: "Skills",
      languages: "Languages",
      certifications: "Certifications",
      awards: "Awards",
      volunteering: "Volunteering",
    },
    pdfSettings: {
      fontFamily: "Work Sans",
      fontSize: 14,
      fontCategory: "ATS-Friendly",
      lineHeight: 5,
      scale: 0.65,
      verticalSpacing: 2,
      pageBreakLine: true,
      skillsLayout: "inline",
      margin: {
        MIN: 10,
        MAX: 50,
        VALUE: 20,
        INITIAL: 20,
      },
    },
  };
}

// Fallback review structure when AI fails
function createFallbackReviewStructure(): Analysis | null {
  return {
    overallScore: 0,
    jobFitPercentage: 0,
    summary: { strengths: [], weaknesses: [], fitLevel: "" },
    detailedAnalysis: {
      contentAlignment: {
        score: 0,
        feedback: "",
        matchingSkills: [],
        missingSkills: [],
      },
      experienceRelevance: {
        score: 0,
        feedback: "",
        relevantExperience: [],
        experienceGaps: [],
      },
      resumeStructure: {
        score: 0,
        feedback: "",
        sectionsToImprove: [{ sectionName: "", improvement: "" }],
      },
      atsCompatibility: { score: 0, feedback: "", missingKeywords: [] },
    },
    recommendations: { highPriority: [], mediumPriority: [], lowPriority: [] },
    specificImprovements: {
      professionalSummary: "",
      skillsSection: "",
      experienceSection: "",
      educationSection: "",
      additionalSections: "",
    },
    nextSteps: [],
    estimatedImprovementTime: "",
  };
}
// CV validation function from the image processing
function validateCVData(parsedData: ResumeType["resumeData"]): void {
  // Check if we got any meaningful data at all
  if (!parsedData || typeof parsedData !== "object") {
    throw new Error("Invalid data format received from image processing");
  }

  // Check for basic CV structure
  const hasBasicInfo =
    parsedData.basics &&
    (parsedData.basics.name ||
      parsedData.basics.email ||
      parsedData.basics.phone?.value);

  const hasExperience =
    parsedData.experience &&
    Array.isArray(parsedData.experience) &&
    parsedData.experience.length > 0 &&
    parsedData.experience.some((exp: Experience) => exp.name || exp.position);

  const hasEducation =
    parsedData.education &&
    Array.isArray(parsedData.education) &&
    parsedData.education.length > 0 &&
    parsedData.education.some((edu: Education) => edu.name || edu.degree);

  const hasProjects =
    parsedData.projects &&
    Array.isArray(parsedData.projects) &&
    parsedData.projects.length > 0 &&
    parsedData.projects.some((proj: Project) => proj.name || proj.description);

  const hasSkills =
    parsedData.skills &&
    Array.isArray(parsedData.skills) &&
    parsedData.skills.length > 0 &&
    parsedData.skills.some((skill: Skill) => skill.name);

  const hasSummary =
    parsedData.summary &&
    parsedData.summary.content &&
    parsedData.summary.content.trim().length > 20; // At least 20 characters

  // Count how many CV sections we found
  const cvSectionCount = [
    hasBasicInfo,
    hasExperience,
    hasEducation,
    hasProjects,
    hasSkills,
    hasSummary,
  ].filter(Boolean).length;

  // Must have at least 2 CV-related sections to be considered a valid CV
  if (cvSectionCount < 2) {
    throw new Error(
      "This doesn't appear to be a CV/Resume. Please upload an image containing a CV or resume document."
    );
  }

  // Additional validation: must have either basic info + one other section, or experience/education
  if (!hasBasicInfo && !hasExperience && !hasEducation) {
    throw new Error(
      "Could not find essential CV information (name, contact details, experience, or education). Please ensure the image contains a clear CV/Resume."
    );
  }

  // Check for minimum content quality
  if (
    hasBasicInfo &&
    parsedData.basics.name &&
    parsedData.basics.name.length < 2
  ) {
    throw new Error(
      "The extracted name is too short. Please ensure the image quality is good and contains readable text."
    );
  }

  // Additional checks for non-CV content patterns
  const allTextContent = JSON.stringify(parsedData).toLowerCase();

  // Common non-CV content indicators
  const nonCVIndicators = [
    "recipe",
    "cooking",
    "ingredients",
    "directions",
    "menu",
    "restaurant",
    "food",
    "invoice",
    "receipt",
    "purchase",
    "payment",
    "article",
    "news",
    "blog post",
    "book",
    "chapter",
    "novel",
    "advertisement",
    "promotion",
    "sale",
    "social media",
    "tweet",
    "post",
    "screenshot",
    "error message",
    "code snippet",
  ];

  const foundNonCVIndicators = nonCVIndicators.filter((indicator) =>
    allTextContent.includes(indicator)
  );

  if (foundNonCVIndicators.length > 2) {
    throw new Error(
      `This appears to be a ${foundNonCVIndicators[0]} document rather than a CV/Resume. Please upload a CV or resume image.`
    );
  }

  // Check for CV/Resume keywords (positive indicators)
  const cvKeywords = [
    "experience",
    "education",
    "skills",
    "resume",
    "cv",
    "work",
    "employment",
    "job",
    "position",
    "university",
    "college",
    "degree",
    "certification",
    "project",
    "summary",
    "objective",
    "profile",
    "qualification",
  ];

  const foundCVKeywords = cvKeywords.filter((keyword) =>
    allTextContent.includes(keyword)
  ).length;

  if (foundCVKeywords < 2) {
    throw new Error(
      "This image doesn't contain typical CV/Resume content. Please upload a proper CV or resume document."
    );
  }
}

// AI CV Review
const AI_REVIEW_USER_PROMPT = (
  resume: string,
  jobTitle: string,
  jobDescription: string
) => {
  return `Analyze this resume for the role below and return ONLY a JSON object.

JOB TITLE: ${jobTitle}
JOB DESCRIPTION: ${jobDescription}

RESUME:
${resume}

RESPONSE RULES:
- If job title or description is meaningless: set overallScore to 0, jobFitPercentage to 0
- If resume is empty or not a CV: set isResume to false
- Only include keys in "specificImprovements" where actual deficiencies exist
- The CV title should match the job title

REQUIRED JSON STRUCTURE:
{
  "overallScore": number,
  "jobFitPercentage": number,
  "isResume": boolean,
  "summary": {
    "strengths": [string],
    "weaknesses": [string],
    "fitLevel": "Excellent" | "Good" | "Fair" | "Poor"
  },
  "detailedAnalysis": {
    "contentAlignment": {
      "score": number,
      "feedback": string,
      "matchingSkills": [string],
      "missingSkills": [string]
    },
    "experienceRelevance": {
      "score": number,
      "feedback": string,
      "relevantExperience": [string],
      "experienceGaps": [string]
    },
    "resumeStructure": {
      "score": number,
      "feedback": string,
      "sectionsToImprove": [{ "sectionName": string, "improvement": string }]
    },
    "atsCompatibility": {
      "score": number,
      "feedback": string,
      "missingKeywords": [string]
    }
  },
  "recommendations": {
    "highPriority": [string],
    "mediumPriority": [string],
    "lowPriority": [string]
  },
  "specificImprovements": {
    "professionalSummary"?: [string],
    "skillsSection"?: [string],
    "experienceSection"?: [string],
    "educationSection"?: [string],
    "projectsSection"?: [string],
    "additionalSections"?: [string]
  },
  "nextSteps": [string],
  "estimatedImprovementTime": string
}`;
};

export async function aiReview(
  resume: string,
  jobTitle: string,
  jobDescription: string
): Promise<Analysis> {
  for (const model of MODELS) {
    try {
      const response = await groq.chat.completions.create({
        model,
        temperature: 0.5,
        max_tokens: 4096,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: AI_REVIEW_SYSTEM_PROMPT },
          {
            role: "user",
            content: AI_REVIEW_USER_PROMPT(resume, jobTitle, jobDescription),
          },
        ],
      });

      const raw = response.choices[0]?.message?.content;
      if (!raw) throw new Error("No response from AI model.");

      const parsedReview = JSON.parse(raw) as Analysis;

      if (parsedReview?.isResume === false) {
        throw new Error("Cannot analyze an empty or invalid resume.");
      }

      if (parsedReview?.jobFitPercentage === 0) {
        throw new Error("Please enter a valid job title and description.");
      }

      return parsedReview;
    } catch (error) {
      if (error instanceof Error) {
        const isRateLimitExceeded =
          error.message.includes("rate_limit_exceeded") ||
          error.message.includes("Rate limit") ||
          error.message.includes("Request too large") ||
          error.message.includes("tokens per minute");

        if (isRateLimitExceeded) {
          console.warn(`Rate limit hit on model: ${model}. Trying next...`);
          continue;
        }

        // non-rate-limit error — fail immediately
        toast({
          title: "Failed to analyze resume",
          description: error.message,
          variant: "destructive",
        });
        return createFallbackReviewStructure();
      }
    }
  }

  // all models exhausted
  toast({
    title: "All AI models are currently busy",
    description: "Please wait a moment and try again.",
    variant: "destructive",
  });
  return createFallbackReviewStructure();
}
