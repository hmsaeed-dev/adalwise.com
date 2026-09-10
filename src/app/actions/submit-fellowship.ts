"use server";

import fs from "fs";
import path from "path";
import { z } from "zod";

const FellowshipInputSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(6, "Phone number required"),
  city: z.string().min(2, "City required"),
  background: z.string(),
  interests: z.array(z.string()).default([]),
  statement: z.string().min(10, "Statement must be at least 10 characters"),
});

export type FellowshipInput = z.infer<typeof FellowshipInputSchema>;

export async function submitFellowshipAction(formData: FellowshipInput) {
  try {
    const validated = FellowshipInputSchema.parse(formData);

    const submissionsDir = path.join(process.cwd(), "content", "submissions");
    if (!fs.existsSync(submissionsDir)) {
      fs.mkdirSync(submissionsDir, { recursive: true });
    }

    const filePath = path.join(submissionsDir, "fellowship.json");
    let currentList: any[] = [];
    if (fs.existsSync(filePath)) {
      try {
        currentList = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch {}
    }

    const entry = {
      id: `fel-${Date.now()}`,
      ...validated,
      submittedAt: new Date().toISOString(),
    };

    currentList.push(entry);
    fs.writeFileSync(filePath, JSON.stringify(currentList, null, 2), "utf-8");

    return {
      success: true,
      message: "Application successfully submitted to the fellowship intake council.",
    };
  } catch (err: any) {
    console.error("Fellowship submission error:", err);
    return {
      success: false,
      error: err.message || "Failed to submit application",
    };
  }
}
