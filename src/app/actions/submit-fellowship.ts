"use server";

import fs from "fs";
import path from "path";
import { z } from "zod";
import { siteConfig } from "@/config/site";

const FellowshipInputSchema = z.object({
	fullName: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Valid email required"),
	phone: z.string().min(6, "Phone number required"),
	background: z.string().min(1, "Background selection required"),
	interests: z.array(z.string()).default([]),
});

export type FellowshipInput = z.infer<typeof FellowshipInputSchema>;

export interface FellowshipEntry extends FellowshipInput {
	id: string;
	submittedAt: string;
}

/**
 * Dispatches an email notification to the site administrator using the Resend REST API.
 * Uses zero npm dependencies via native fetch.
 */
async function dispatchResendEmail(entry: FellowshipEntry): Promise<{ id?: string }> {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		console.warn("RESEND_API_KEY is not set. Skipping email dispatch.");
		return {};
	}

	const toEmail = process.env.ADMIN_NOTIFICATION_EMAIL || siteConfig.author.email || "founder@adlwise.com";
	const fromEmail = process.env.RESEND_FROM_EMAIL || "Adlwise Intake <onboarding@resend.dev>";
	const cleanPhone = entry.phone.replace(/[^0-9]/g, "");
	const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
	const formattedDate = new Date(entry.submittedAt).toLocaleString("en-US", {
		timeZone: "UTC",
		dateStyle: "full",
		timeStyle: "short",
	});

	const interestBadges = entry.interests.length > 0
		? entry.interests
				.map(
					(int) =>
						`<span style="display:inline-block;background-color:#f1f5f9;color:#0f172a;padding:4px 10px;border-radius:9999px;font-size:12px;font-weight:600;margin:2px 4px 2px 0;">${int}</span>`,
				)
				.join(" ")
		: `<span style="color:#64748b;font-style:italic;">None specified</span>`;

	const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>New Fellowship Application</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;margin:0;padding:24px;background-color:#f8fafc;color:#1e293b;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
    <thead>
      <tr>
        <td style="background-color:#0f172a;padding:28px 32px;color:#ffffff;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#94a3b8;">Adlwise Circle • Intake Council</p>
          <h1 style="margin:8px 0 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.2;">New Fellowship Application</h1>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:32px;">
          <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#475569;">
            A new introduction has been submitted through the <strong>Adlwise</strong> website intake form.
          </p>

          <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;width:130px;vertical-align:top;font-weight:600;">Full Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#0f172a;font-weight:600;">${entry.fullName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;vertical-align:top;font-weight:600;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#0f172a;">
                <a href="mailto:${entry.email}" style="color:#0284c7;text-decoration:none;">${entry.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;vertical-align:top;font-weight:600;">Phone / WhatsApp</td>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#0f172a;">
                ${entry.phone}
                ${waUrl ? ` &nbsp;•&nbsp; <a href="${waUrl}" target="_blank" style="color:#16a34a;text-decoration:none;font-weight:600;font-size:12px;">Open WhatsApp →</a>` : ""}
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;vertical-align:top;font-weight:600;">Background</td>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#0f172a;font-weight:500;">${entry.background}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;vertical-align:top;font-weight:600;">Interests</td>
              <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#0f172a;">
                ${interestBadges}
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;font-size:12px;color:#94a3b8;vertical-align:top;">Submitted (UTC)</td>
              <td style="padding:10px 0;font-size:12px;color:#94a3b8;">${formattedDate} &bull; ID: <code style="font-size:11px;">${entry.id}</code></td>
            </tr>
          </table>

          <div style="background-color:#f8fafc;border-left:3px solid #0f172a;padding:12px 16px;border-radius:4px;margin-top:16px;">
            <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">
              Tip: Replying directly to this email will reply directly to <strong>${entry.fullName}</strong> (${entry.email}).
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="margin:0;font-size:11px;color:#94a3b8;letter-spacing:0.05em;">
            Adlwise • Justice & Wisdom • <a href="https://adlwise.com" style="color:#64748b;text-decoration:none;">adlwise.com</a>
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;

	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			from: fromEmail,
			to: [toEmail],
			reply_to: entry.email,
			subject: `New Fellowship Application: ${entry.fullName} (${entry.background})`,
			html: htmlContent,
		}),
	});

	if (!res.ok) {
		const errorBody = await res.text();
		throw new Error(`Resend API rejected with status ${res.status}: ${errorBody}`);
	}

	return (await res.json()) as { id?: string };
}

/**
 * Appends the submission row to a Google Sheet via a Google Apps Script Webhook.
 * Accepts GOOGLE_SHEET_WEBHOOK_URL or fallback FELLOWSHIP_WEBHOOK_URL.
 */
async function dispatchGoogleSheetWebhook(entry: FellowshipEntry): Promise<{ status?: string }> {
	const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.FELLOWSHIP_WEBHOOK_URL;
	if (!webhookUrl) {
		console.warn("GOOGLE_SHEET_WEBHOOK_URL is not set. Skipping sheet dispatch.");
		return {};
	}

	const res = await fetch(webhookUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(entry),
		redirect: "follow",
	});

	if (!res.ok) {
		const errorBody = await res.text();
		throw new Error(`Google Sheet Webhook rejected with status ${res.status}: ${errorBody}`);
	}

	try {
		return (await res.json()) as { status?: string };
	} catch {
		return { status: "ok" };
	}
}

/**
 * Attempts local file storage for local development environments.
 * Gracefully silences EROFS in serverless environments (Vercel, AWS Lambda).
 */
async function persistLocalBackup(entry: FellowshipEntry): Promise<void> {
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
	} catch {
		// In serverless environments (Vercel), the filesystem is read-only.
		// Silently continue without throwing.
	}
}

export async function submitFellowshipAction(formData: FellowshipInput) {
	try {
		const validated = FellowshipInputSchema.parse(formData);

		const entry: FellowshipEntry = {
			id: `fel-${Date.now()}`,
			...validated,
			submittedAt: new Date().toISOString(),
		};

		// Dispatch to Resend email, Google Sheet ledger, and local dev storage concurrently
		const [emailResult, sheetResult, localResult] = await Promise.allSettled([
			dispatchResendEmail(entry),
			dispatchGoogleSheetWebhook(entry),
			persistLocalBackup(entry),
		]);

		if (emailResult.status === "rejected") {
			console.error("Failed to send Resend email notification:", emailResult.reason);
		}
		if (sheetResult.status === "rejected") {
			console.error("Failed to log entry to Google Sheet webhook:", sheetResult.reason);
		}
		if (localResult.status === "rejected") {
			console.warn("Local storage backup skipped:", localResult.reason);
		}

		// Cloud log entry for trace verification in Vercel runtime logs
		console.log(
			`[Fellowship Intake] Received application from "${entry.fullName}" (${entry.email}) [ID: ${entry.id}]. Email status: ${emailResult.status}, Sheet status: ${sheetResult.status}`,
		);

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
