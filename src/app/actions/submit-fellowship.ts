"use server";

import fs from "fs";
import path from "path";
import { z } from "zod";

const FellowshipInputSchema = z.object({
	fullName: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Valid email required"),
	phone: z.string().min(6, "Phone number required"),
	background: z.string(),
	interests: z.array(z.string()).default([]),
});

export type FellowshipInput = z.infer<typeof FellowshipInputSchema>;

export interface FellowshipEntry extends FellowshipInput {
	id: string;
	submittedAt: string;
}

export async function submitFellowshipAction(formData: FellowshipInput) {
	try {
		const validated = FellowshipInputSchema.parse(formData);

		const entry: FellowshipEntry = {
			id: `fel-${Date.now()}`,
			...validated,
			submittedAt: new Date().toISOString(),
		};

		// Forward to webhook dispatcher if configured in environment
		const webhookUrl = process.env.FELLOWSHIP_WEBHOOK_URL;
		if (webhookUrl) {
			try {
				await fetch(webhookUrl, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(entry),
				});
			} catch (webhookErr) {
				console.error("Failed to dispatch fellowship webhook:", webhookErr);
			}
		}

		// Attempt local filesystem persistence; gracefully degrade in serverless read-only runtimes (EROFS)
		try {
			const submissionsDir = path.join(process.cwd(), "content", "submissions");
			if (!fs.existsSync(submissionsDir)) {
				fs.mkdirSync(submissionsDir, { recursive: true });
			}

			const filePath = path.join(submissionsDir, "fellowship.json");
			let currentList: FellowshipEntry[] = [];
			if (fs.existsSync(filePath)) {
				try {
					currentList = JSON.parse(fs.readFileSync(filePath, "utf-8")) as FellowshipEntry[];
				} catch {
					currentList = [];
				}
			}

			currentList.push(entry);
			fs.writeFileSync(filePath, JSON.stringify(currentList, null, 2), "utf-8");
		} catch (fsErr) {
			// In serverless environments (e.g. Vercel, AWS Lambda), the filesystem is read-only.
			// Log submission to stdout for cloud log aggregation without throwing EROFS.
			console.warn("Serverless runtime filesystem is read-only; recorded fellowship submission in log:", JSON.stringify(entry));
		}

		return {
			success: true,
			message: "Application successfully submitted to the fellowship intake council.",
		};
	} catch (err: unknown) {
		console.error("Fellowship submission error:", err);
		const errorMessage = err instanceof Error ? err.message : "Failed to submit application";
		return {
			success: false,
			error: errorMessage,
		};
	}
}
