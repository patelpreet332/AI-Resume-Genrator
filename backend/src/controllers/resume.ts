import { Request, Response } from "express";
import { generateResume } from "../services/resume";
import { ResumeInput } from "../types/resume";

/**
 * Controller for the resume generation endpoint.
 * Handles request validation and orchestrates the service call.
 */
export const generateResumeController = async (
  req: Request,
  res: Response
) => {
  try {
    const input: ResumeInput = req.body;

    const resume = await generateResume(input);

    res.json({ data: resume });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
