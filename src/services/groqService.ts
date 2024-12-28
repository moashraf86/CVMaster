import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

//
export async function rewriteContentWithAi(content: string | object) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Rewrite the following content to make it concise and professional, keeping the HTML structure intact: "${content}"`,
        },
        {
          role: "system",
          content:
            "I need help rewriting the following content to make it concise and professional. Please keep the HTML structure (e.g., <p>, <h1>, <ul>) the same as the original content. Do not add any titles or additional headings. Only return the revised content without any prefacing or introductory text.",
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
