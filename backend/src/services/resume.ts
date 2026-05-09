import { model } from "../config/gemini";
import { ResumeInput } from "../types/resume";
import { buildPrompt } from "../utils/promptBuilder";

/**
 * Generates a professional resume using Google Gemini AI.
 * 
 * @param data - The raw resume input data from the user.
 * @returns A structured resume object or raw text if parsing fails.
 */
export const generateResume = async (data: ResumeInput) => {
  const prompt = buildPrompt(data);

  const result = await model.generateContent(prompt);
  const response = await result.response;

  const text = response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    return { raw: text };
  }
};
