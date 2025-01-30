import Groq from "groq-sdk";

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
      model: "llama-3.3-70b-versatile",
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
      model: "llama-3.3-70b-versatile",
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
      model: "llama-3.3-70b-versatile",
    });

    return response.choices[0]?.message?.content?.trim() || "No response";
  } catch (error) {
    console.log(error);
    return "No response";
  }
}
