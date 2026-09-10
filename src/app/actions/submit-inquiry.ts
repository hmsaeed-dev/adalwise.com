"use server";

import fs from "fs";
import path from "path";
import { z } from "zod";

const InquiryInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email address required"),
  affiliation: z.string().optional(),
  query: z.string().min(10, "Query must be at least 10 characters"),
});

export type InquiryInput = z.infer<typeof InquiryInputSchema>;

export async function submitInquiryAction(formData: InquiryInput) {
  try {
    const validated = InquiryInputSchema.parse(formData);

    const submissionsDir = path.join(process.cwd(), "content", "submissions");
    if (!fs.existsSync(submissionsDir)) {
      fs.mkdirSync(submissionsDir, { recursive: true });
    }

    const filePath = path.join(submissionsDir, "inquiries.json");
    let currentList: any[] = [];
    if (fs.existsSync(filePath)) {
      try {
        currentList = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch {}
    }

    const entry = {
      id: `inq-${Date.now()}`,
      ...validated,
      submittedAt: new Date().toISOString(),
    };

    currentList.push(entry);
    fs.writeFileSync(filePath, JSON.stringify(currentList, null, 2), "utf-8");

    return {
      success: true,
      message: "Academic inquiry successfully logged with the faculty council.",
    };
  } catch (err: any) {
    console.error("Inquiry submission error:", err);
    return {
      success: false,
      error: err.message || "Failed to dispatch inquiry",
    };
  }
}
