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

// Generate JSON from text
export async function generateJSONFromText(text: string) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert CV/Resume parser. Your task is to extract information from CV/Resume text and convert it to a specific JSON format.

					CRITICAL: Never use null bytes, control characters, or special Unicode characters in your output. Use only standard ASCII characters, letters, numbers, spaces, and basic punctuation (.,;:-!?). For date ranges, always use regular hyphen character (-).

					FORMATTING RULES: Always convert lists to proper HTML:
					- Any bullet points (•, -, *, etc.) must become <ul><li>item 1</li><li>item 2</li></ul>
					- Any numbered lists (1., 2., a), b), etc.) must become <ol><li>item 1</li><li>item 2</li></ol>
					- Never leave bullet symbols or numbers as plain text

					Always return valid JSON only, no additional text or explanations.`,
        },
        {
          role: "user",
          content: `Parse the following CV/Resume text and convert it to JSON format. Extract all relevant information and place it in the appropriate sections. If any information is missing, use empty strings or empty arrays as appropriate.

					IMPORTANT RULES:
					- Return ONLY the JSON object, no markdown code blocks, no explanations, no additional text
					- NEVER use null bytes (\u0000) or any special Unicode characters
					- For date ranges, use regular hyphen: "Jul 2023 - Present" (not special dashes or symbols)
					- Use only standard characters: letters, numbers, spaces, basic punctuation
					- Clean any unusual characters from the source text
					- CRITICAL: Convert ALL lists to proper HTML format:
					  * Bullet points (•, -, *, etc.) → <ul><li>item</li><li>item</li></ul>
					  * Numbers (1., 2., a), etc.) → <ol><li>item</li><li>item</li></ol>
					  * Never leave bullets or dashes as plain text
					- CONTENT FIELD RULES:
					  * "description" fields: Plain text only, no HTML formatting, brief summary
					  * "summary" fields: Full HTML formatting preserved, complete detailed content
						* don't repeat the same information in the description and summary fields
						* don't add any additional information that is not present in the text

					CV Text:
					${text}

					Return the data in this exact JSON structure:

					{
						"basics": {
							"name": "",
							"title": "",
							"email": "",
							"linkedin": "",
							"website": "",
							"phone": {
								"value": "",
								"breakAfter": false
							},
							"location": {
								"value": "",
								"breakAfter": true
							},
							"customFields": [],
							"alignment": "start"
						},
						"summary": {
							"sectionTitle": "Summary",
							"content": ""
						},
						"experience": [
							{
								"name": "",
								"position": "",
								"dateRange": "",
								"location": "",
								"employmentType": "",
								"website": "",
								"summary": "",
								"id": ""
							}
						],
						"projects": [
							{
								"name": "Project 1 Name",
								"description": "Brief one-line description of the project",
								"date": "2023",
								"website": "",
								"summary": "Full detailed summary with <b>formatting</b>, <ul><li>bullet points</li><li>multiple items</li></ul> and complete project details",
								"keywords": ["keyword1", "keyword2"],
								"id": "123e4567-e89b-12d3-a456-426614174001"
							},
							{
								"name": "Project 2 Name",
								"description": "Another brief project description",
								"date": "2022",
								"website": "",
								"summary": "Complete project details with <ol><li>numbered lists</li><li>formatted content</li></ol> and <i>styling preserved</i>",
								"keywords": ["keyword3", "keyword4"],
								"id": "123e4567-e89b-12d3-a456-426614174002"
							}
						],
						"education": [
							{
								"id": "",
								"name": "",
								"degree": "",
								"studyField": "",
								"date": "",
								"website": "",
								"summary": ""
							}
						],
						"skills": [
							{
								"id": "",
								"name": "",
								"keywords": []
							}
						],
						"languages": [
							{
								"name": "",
								"level": "",
								"id": ""
							}
						],
						"certifications": [
							{
								"id": "",
								"name": "",
								"date": "",
								"issuer": "",
								"website": "",
								"summary": ""
							}
						],
						"awards": [
							{
								"id": "",
								"name": "",
								"date": "",
								"issuer": "",
								"website": "",
								"summary": ""
							}
						],
						"volunteering": [
							{
								"id": "",
								"name": "",
								"position": "",
								"date": "",
								"location": "",
								"summary": ""
							}
						],
						"sectionTitles": {
							"summary": "Summary",
							"experience": "Experience",
							"projects": "Projects",
							"education": "Education",
							"skills": "Skills",
							"languages": "Languages",
							"certifications": "Certifications",
							"awards": "Awards",
							"volunteering": "Volunteering"
						},
						"pdfSettings": {
							"fontFamily": "Work Sans",
							"fontSize": 14,
							"fontCategory": "ATS-Friendly",
							"lineHeight": 5,
							"scale": 0.65,
							"verticalSpacing": 2,
							"pageBreakLine": true,
							"skillsLayout": "inline",
							"margin": {
								"MIN": 10,
								"MAX": 50,
								"VALUE": 20,
								"INITIAL": 20
							}
						}
					}

							Instructions:
							- Extract ALL information from the CV - do not truncate or skip any sections
							- Extract name, email, phone, LinkedIn, website from the text
							- Parse ALL work experience entries with company names, positions, dates, and descriptions
							- Extract ALL education entries including institution, degree, field of study, and dates
							- Find and include ALL projects mentioned in the CV - each project should be a separate object in the projects array
							- For each project, extract TWO types of content:
							  * "description": A brief, plain text summary (1-2 sentences max, no formatting)
							  * "summary": The complete, detailed project information with ALL original formatting preserved
							- FORMATTING PRESERVATION: In the "summary" field, maintain all original styling:
							  * Convert bold text to <b>text</b>
							  * Convert underlined text to <u>text</u>
							  * Convert italic text to <i>text</i>
							  * Convert bullet points to <ul><li>item</li></ul>
							  * Convert numbered lists to <ol><li>item</li></ol>
							  * Preserve all list structures and formatting from the original document
							- The "description" field should be clean, plain text without any HTML formatting
							- The "summary" field should contain the full, formatted content with all styling preserved
							- Identify and categorize skills (group similar technologies together)
							- Extract languages and proficiency levels
							- Look for ALL projects, certifications, awards, and volunteering experiences - include every one found
							- Generate unique IDs for each item using uuid v4 format (e.g. "123e4567-e89b-12d3-a456-426614174000")
							- IMPORTANT: If multiple projects exist, create separate objects for each project in the projects array
							- PROJECT CONTENT SEPARATION:
							  * Use "description" for: Short, plain text overview (no HTML, 1-2 sentences)
							  * Use "summary" for: Full detailed content with complete HTML formatting preserved
							  * Example: description: "A web application for task management"
							  * Example: summary: "Built a <b>responsive task management system</b> with the following features: <ul><li>User authentication</li><li>Real-time updates</li><li>Mobile optimization</li></ul>"
							- If employment type is not specified, leave it as empty string
							- Convert any HTML-like formatting in descriptions to proper HTML tags without using quotes or backticks
							- Do not use any markdown formatting in the descriptions and summaries
							- When detecting text formatting, reproduce it in valid HTML: <b> for bold, <u> for underline, <i> for italic
							- IMPORTANT: Always detect and convert lists to proper HTML:
							  * If you see bullet points (•, -, *, etc.) convert to <ul><li>item 1</li><li>item 2</li></ul>
							  * If you see numbered lists (1., 2., a), b), etc.) convert to <ol><li>item 1</li><li>item 2</li></ol>
							  * Never leave lists as plain text with bullet symbols or dashes
							  * Each list item should be wrapped in <li></li> tags
							  * Multiple paragraphs or line breaks within descriptions should use proper HTML list formatting
							- Preserve line breaks using <br> where appropriate, but prefer proper list formatting for list content
							- Ensure all dates use standard format with regular hyphen: "Jan 2020 - Present", "2018 - 2022"
							- If there is no date, leave it as empty string
							- Don't add sections not present in the document
							- If no skills listed, extract relevant skills from experience and projects
							- Don't add Language section if no languages mentioned
							- Always include the pdfSettings object exactly as shown
							- Remember: Use ONLY standard characters, no special symbols or Unicode characters
							- Return only the JSON object, no additional formatting or text`,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 1,
      max_tokens: 8096,
      top_p: 0.9,
      response_format: {
        type: "json_object",
      },
      stop: null,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("No response from AI");
    }

    // Clean the response - remove markdown code blocks and unwanted text
    const cleanedContent = cleanAIResponse(content);

    // Try to parse the JSON to ensure it's valid
    try {
      const parsedJSON = JSON.parse(cleanedContent);
      // Ensure required structure exists
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
          margin: {
            MIN: 10,
            MAX: 50,
            VALUE: 20,
            INITIAL: 20,
          },
        };
      }

      return parsedJSON;
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      toast({
        title: "Failed to parse AI response as JSON.",
        description: `${
          parseError instanceof Error ? parseError.message : "Unknown error"
        }`,
        variant: "destructive",
      });
      // Return a fallback structure
      return createFallbackStructure();
    }
  } catch (error) {
    console.error("Error generating JSON from text:", error);
    const errorMessage =
      error instanceof Error
        ? error.message && error.message.includes("Rate limit reached")
          ? "Rate limit exceeded. Please try again later."
          : error.message
        : "Unknown error";
    toast({
      title: "Failed Extracting Data from PDF",
      description: `${errorMessage}. Please try again later or change the AI Model from Controls`,
      variant: "destructive",
    });
  }
}
// Generate JSON from image
// New function for Vision API
export const generateJSONFromImage = async (
  base64Image: string,
  mimeType: string
) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert CV/Resume parser. Your task is to extract information from CV/Resume content (from an image) and convert it to a specific JSON format.

CRITICAL: Never use null bytes, control characters, or special Unicode characters in your output. Use only standard ASCII characters, letters, numbers, spaces, and basic punctuation (.,;:-!?). For date ranges, always use regular hyphen character (-).

FORMATTING RULES: Always convert lists to proper HTML:
- Any bullet points (•, -, *, etc.) must become <ul><li>item 1</li><li>item 2</li></ul>
- Any numbered lists (1., 2., a), b), etc.) must become <ol><li>item 1</li><li>item 2</li></ol>
- Never leave bullet symbols or numbers as plain text

Always return valid JSON only, no additional text or explanations.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract the following CV/Resume image and convert it to JSON format. Extract all relevant information and place it in the appropriate sections. If any information is missing, use empty strings or empty arrays as appropriate.

							IMPORTANT RULES:
							- Return ONLY the JSON object, no markdown code blocks, no explanations, no additional text
							- if not found any information, return empty object {}, not the fallback structure
							- NEVER use null bytes (\u0000) or any special Unicode characters
							- For date ranges, use regular hyphen: "Jul 2023 - Present" (not special dashes or symbols)
							- Use only standard characters: letters, numbers, spaces, basic punctuation
							- Clean any unusual characters from the source text
							- CRITICAL: Convert ALL lists to proper HTML format:
							  * Bullet points (•, -, *, etc.) → <ul><li>item</li><li>item</li></ul>
							  * Numbers (1., 2., a), etc.) → <ol><li>item</li><li>item</li></ol>
							  * Never leave bullets or dashes as plain text
							- CONTENT FIELD RULES:
							  * "description" fields: Plain text only, no HTML formatting, brief summary
							  * "summary" fields: Full HTML formatting preserved, complete detailed content

							Return the data in this exact JSON structure:

							{
								"basics": {
									"name": "",
									"title": "",
									"email": "",
									"linkedin": "",
									"website": "",
									"phone": {
										"value": "",
										"breakAfter": false
									},
									"location": {
										"value": "",
										"breakAfter": true
									},
									"customFields": [],
									"alignment": "start"
								},
								"summary": {
									"sectionTitle": "Summary",
									"content": ""
								},
								"experience": [
									{
										"name": "",
										"position": "",
										"dateRange": "",
										"location": "",
										"employmentType": "",
										"website": "",
										"summary": "",
										"id": "" // unique for each experience in the experience array
									}
								],
								"projects": [
									{
										"name": "Project 1 Name",
										"description": "Brief one-line description of the project",
										"date": "2023",
										"website": "",
										"summary": "Full detailed summary with <b>formatting</b>, <ul><li>bullet points</li><li>multiple items</li></ul> and complete project details",
										"keywords": ["keyword1", "keyword2"],
										"id": "" // unique for each project in the projects array
									},
									{
										"name": "Project 2 Name",
										"description": "Another brief project description",
										"date": "2022",
										"website": "",
										"summary": "Complete project details with <ol><li>numbered lists</li><li>formatted content</li></ol> and <i>styling preserved</i>",
										"keywords": ["keyword3", "keyword4"],
										"id": "" // unique for each project in the projects array
									}
								],
								"education": [
									{
										"id": "", // unique for each education
										"name": "",
										"degree": "",
										"studyField": "",
										"date": "",
										"website": "",
										"summary": ""
									}
								],
								"skills": [
									{
										"id": "", // unique for each skill
										"name": "",
										"keywords": []
									}
								],
								"languages": [
									{
										"name": "",
										"level": "",
										"id": "" // unique for each language
									}
								],
								"certifications": [
									{
										"id": "", // unique for each certification
										"name": "",
										"date": "",
										"issuer": "",
										"website": "",
										"summary": ""
									}
								],
								"awards": [
									{
										"id": "",
										"name": "",
										"date": "",
										"issuer": "",
										"website": "",
										"summary": ""
									}
								],
								"volunteering": [
									{
										"id": "", // unique for each volunteering
										"name": "",
										"position": "",
										"date": "",
										"location": "",
										"summary": ""
									}
								],
								"sectionTitles": {
									"summary": "Summary",
									"experience": "Experience",
									"projects": "Projects",
									"education": "Education",
									"skills": "Skills",
									"languages": "Languages",
									"certifications": "Certifications",
									"awards": "Awards",
									"volunteering": "Volunteering"
								},
								"pdfSettings": {
									"fontFamily": "Work Sans",
									"fontSize": 14,
									"fontCategory": "ATS-Friendly",
									"lineHeight": 5,
									"scale": 0.65,
									"verticalSpacing": 2,
									"pageBreakLine": true,
									skillsLayout: "inline",
									"margin": {
										"MIN": 10,
										"MAX": 50,
										"VALUE": 20,
										"INITIAL": 20
									}
								}
							}

							Instructions:
							- Extract ALL information from the CV - do not truncate or skip any sections
							- Extract name, email, phone, LinkedIn, website from the image
							- Parse ALL work experience entries with company names, positions, dates, and descriptions
							- Extract ALL education entries including institution, degree, field of study, and dates
							- Find and include ALL projects mentioned in the CV - each project should be a separate object in the projects array
							- For each project, extract TWO types of content:
							  * "description": A brief, plain text summary (1-2 sentences max, no formatting)
							  * "summary": The complete, detailed project information with ALL original formatting preserved
							- FORMATTING PRESERVATION: In the "summary" field, maintain all original styling:
							  * Convert bold text to <b>text</b>
							  * Convert underlined text to <u>text</u>
							  * Convert italic text to <i>text</i>
							  * Convert bullet points to <ul><li>item</li></ul>
							  * Convert numbered lists to <ol><li>item</li></ol>
							  * Preserve all list structures and formatting from the original document
							- The "description" field should be clean, plain text without any HTML formatting
							- The "summary" field should contain the full, formatted content with all styling preserved
							- Identify and categorize skills (group similar technologies together)
							- Extract languages and proficiency levels
							- Look for ALL projects, certifications, awards, and volunteering experiences - include every one found
							- Generate unique IDs for each item using in each section uuid v4 format (e.g. "76fdh-e89b-12d3-a456") unique for each item in the section
							- IMPORTANT: If multiple projects exist, create separate objects for each project in the projects array
							- PROJECT CONTENT SEPARATION:
							  * Use "description" for: Short, plain text overview (no HTML, 1-2 sentences)
							  * Use "summary" for: Full detailed content with complete HTML formatting preserved
							  * Example: description: "A web application for task management"
							  * Example: summary: "Built a <b>responsive task management system</b> with the following features: <ul><li>User authentication</li><li>Real-time updates</li><li>Mobile optimization</li></ul>"
							- If employment type is not specified, leave it as empty string
							- IMPORTANT: Always detect and convert lists to proper HTML:
							  * If you see bullet points (•, -, *, etc.) convert to <ul><li>item 1</li><li>item 2</li></ul>
							  * If you see numbered lists (1., 2., a), b), etc.) convert to <ol><li>item 1</li><li>item 2</li></ol>
							  * Never leave lists as plain text with bullet symbols or dashes
							  * Each list item should be wrapped in <li></li> tags
							  * Multiple paragraphs or line breaks within descriptions should use proper HTML list formatting
							- Preserve line breaks using <br> where appropriate, but prefer proper list formatting for list content
							- Ensure all dates use standard format with regular hyphen: "Jan 2020 - Present", "2018 - 2022"
							- If there is no date, leave it as empty string
							- Don't add sections not present in the document
							- If no skills listed, extract relevant skills from experience and projects
							- Don't add Language section if no languages mentioned
							- Always include the pdfSettings object exactly as shown
							- Remember: Use ONLY standard characters, no special symbols or Unicode characters
							- Return only the JSON object, no additional formatting or text`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 1,
      max_tokens: 8096,
      top_p: 1,
      stream: false,
      response_format: {
        type: "json_object",
      },
      stop: null,
    });

    const jsonResponse = completion.choices[0]?.message?.content;

    if (!jsonResponse) {
      throw new Error("No response received from Vision API");
    }

    const parsedData = JSON.parse(jsonResponse);

    validateCVData(parsedData);

    if (!parsedData.pdfSettings) {
      parsedData.pdfSettings = {
        fontFamily: "Work Sans",
        fontSize: 14,
        fontCategory: "ATS-Friendly",
        lineHeight: 5,
        verticalSpacing: 2,
        scale: 0.65,
        margin: {
          MIN: 10,
          MAX: 50,
          VALUE: 20,
          INITIAL: 20,
        },
        pageBreakLine: true,
        skillsLayout: "inline",
      };
    }

    return parsedData;
  } catch (error) {
    console.error("Groq Vision API error:", error);
    toast({
      title: "Vision API processing failed.",
      description: `${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      variant: "destructive",
    });
    if (error instanceof Error) {
      if (error.message.includes("JSON")) {
        throw new Error("Vision API returned invalid data format");
      } else if (error.message.includes("meaningful resume data")) {
        throw error; // Re-throw our validation error
      } else if (
        error.message.includes("rate limit") ||
        error.message.includes("quota")
      ) {
        throw new Error("API usage limit reached. Please try again later.");
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      }
    }

    throw new Error("Vision API processing failed. Please try again.");
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
export async function aiReview(
  resume: string,
  jobTitle: string,
  jobDescription: string
) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert resume reviewer and career consultant with 15+ years of experience in talent acquisition and career development. Your expertise spans across multiple industries, ATS systems, and recruitment best practices.

					CORE ANALYSIS APPROACH:
					- Conduct evidence-based analysis focusing on actual gaps and opportunities in the specific resume
					- Provide concrete, measurable recommendations tailored to the exact job requirements
					- Prioritize high-impact improvements that directly address identified weaknesses
					- Focus on actionable insights rather than generic advice

					ENHANCED SCORING CRITERIA:
					- 95-100: Exceptional fit, immediately interview-ready, exceeds most requirements
					- 85-94: Strong candidate, minor targeted improvements for optimization
					- 75-84: Good potential, moderate enhancements needed for competitive edge
					- 65-74: Adequate match, significant improvements required
					- 55-64: Needs development, major restructuring necessary
					- Below 55: Poor alignment, fundamental gaps to address

					CRITICAL ANALYSIS REQUIREMENTS:
					- Base ALL feedback on specific deficiencies found in THIS resume
					- Tailor every recommendation to the target job requirements
					- Provide specific examples and concrete action steps
					- Focus on measurable improvements with clear implementation guidance
					- Maintain professional, constructive tone throughout`,
        },
        {
          role: "user",
          content: `
					**RESUME ANALYSIS REQUEST**

					**TARGET POSITION:**
					Job Title: \`\`\`${jobTitle}\`\`\`
					Job Requirements: \`\`\`${jobDescription}\`\`\`

					**CANDIDATE RESUME:**
					\`\`\`${resume}\`\`\`

					**ENHANCED ANALYSIS INSTRUCTIONS:**

					1. **EVIDENCE-BASED EVALUATION**: Analyze only what you observe in the actual resume content. Base all recommendations on specific gaps, weaknesses, or missing elements you identify.

					2. **TARGETED IMPROVEMENTS**: In the "specificImprovements" section, only include areas where you identify actual deficiencies. If a section is strong, omit it entirely. Each improvement must be specific to what's lacking in this particular resume.

					3. **JOB-SPECIFIC FOCUS**: Tailor all feedback to the exact job requirements. Identify missing keywords, skills, and experiences that are specifically mentioned in the job description.

					4. **ACTIONABLE RECOMMENDATIONS**: Provide concrete steps the candidate can take, not general advice. Include specific phrases to add, skills to highlight, or content to modify.

					5. **PRIORITY-BASED APPROACH**: Focus on changes that will have the highest impact on job fit percentage and ATS compatibility.

					6. **CV TITLE**: The title of the CV should match the job title.

					**MANDATORY RESPONSE FORMAT** (maintain exact structure):
					{
						"overallScore": number (0-100),
						"jobFitPercentage": number (0-100),
						"summary": {
							"strengths": [string], // Actual strengths found in this specific resume
							"weaknesses": [string], // Specific weaknesses identified in this resume
							"fitLevel": "Excellent" | "Good" | "Fair" | "Poor"
							},
							"detailedAnalysis": {
								"contentAlignment": {
									"score": number (0-100),
									"feedback": string, // Specific to this resume-job combination
									"matchingSkills": [string], // Skills actually present in resume that match job
									"missingSkills": [string] // Required skills specifically absent from this resume
									},
									"experienceRelevance": {
										"score": number (0-100),
										"feedback": string, // Based on actual experience in this resume
										"relevantExperience": [string], // Specific experiences that align with job
										"experienceGaps": [string] // Specific experience gaps for this role
										},
										"resumeStructure": {
											"score": number (0-100),
											"feedback": string, // Assessment of this resume's actual structure
											"sectionsToImprove": [
												{
													"sectionName": string, // Only sections that actually need improvement
													"improvement": string // Specific improvement needed for this section
													}
													]
													},
													"atsCompatibility": {
														"score": number (0-100),
														"feedback": string, // ATS assessment of this specific resume
														"missingKeywords": [string] // Job-specific keywords missing from this resume
														}
														},
														"recommendations": {
															"highPriority": [string], // Most critical improvements for this specific case
															"mediumPriority": [string], // Important but secondary improvements
															"lowPriority": [string] // Nice-to-have enhancements
															},
															"specificImprovements": {
																// CRITICAL: Only include sections where you identify actual deficiencies
																// If a section is adequate, do NOT include it in the response
																// Each array should contain specific, actionable improvements based on what you observed is missing/weak

																"professionalSummary": [string], // Only if summary needs improvement - specific actions
																"skillsSection": [string], // Only if skills section has gaps - specific skills to add
																"experienceSection": [string], // Only if experience descriptions need work - specific improvements
																"educationSection": [string], // Only if education section needs enhancement
																"projectsSection": [string], // Only if projects section needs enhancement
																"additionalSections": [string] // Only if new sections are needed - specify what to add (e.g. "achievements", "certifications", "projects", languages, etc.)

																// You may add other relevant sections based on what you identify needs improvement:
																// "achievements": [string], "certifications": [string], "projects": [string], etc.
																},
																"nextSteps": [string], // Sequential actions in order of priority
																"estimatedImprovementTime": string // Realistic time estimate for implementing changes
																}

																**CRITICAL REQUIREMENTS:**
																- Return ONLY the JSON object with no additional text
																- Base every recommendation on specific deficiencies you identify in this resume
																- Tailor all suggestions to the exact job requirements provided
																- Include only improvement sections where actual gaps exist
																- Provide actionable, specific guidance rather than generic advice
																- Maintain exact JSON structure to ensure compatibility
																- if user input a meaningless job title or description, return a score of 0 and a message saying "Please enter a valid job title and description"
																- if the resume is not a CV/Resume or empty or contains only, return a isResume: false and a message saying "cannot analyze an empty resume"`,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.5,
      max_tokens: 8192,
      stop: null,
      response_format: { type: "json_object" },
    });

    const review: string = response.choices[0]?.message?.content as string;

    const parsedReview = JSON.parse(review) as Analysis;

    console.log(parsedReview);
    // check if the job title and description are meaningful
    if (parsedReview?.jobFitPercentage === 0) {
      // throw an error
      throw new Error("Please enter a valid job title and description");
    }
    if (parsedReview?.isResume === false) {
      // throw an error
      throw new Error("cannot analyze an empty resume");
    }

    return parsedReview;
  } catch (error) {
    if (error instanceof Error) {
      // if error includes rate limit exceeded, throw a new error
      if (error.message.includes("Rate limit reached")) {
        throw new Error("AI Model Rate limit reached. Please try again later.");
      }
      throw new Error(error.message);
    }
    throw error;
  }
}
