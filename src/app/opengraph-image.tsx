import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

export default async function Image() {
	let logoBase64 = "";
	try {
		const logoPath = path.join(
			process.cwd(),
			"public",
			"images",
			"logo-badge.png",
		);
		if (fs.existsSync(logoPath)) {
			const buf = fs.readFileSync(logoPath);
			logoBase64 = `data:image/png;base64,${buf.toString("base64")}`;
		}
	} catch {
		// Graceful fallback
	}

	return new ImageResponse(
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#00261a",
				color: "#fff9e9",
				padding: "60px",
				fontFamily: "serif",
				position: "relative",
			}}
		>
			{/* Double Manuscript Framing Border (Jadwal) */}
			<div
				style={{
					position: "absolute",
					inset: "24px",
					border: "2px solid #cea72c",
					display: "flex",
				}}
			/>
			<div
				style={{
					position: "absolute",
					inset: "30px",
					border: "1px solid rgba(206, 167, 44, 0.4)",
					display: "flex",
				}}
			/>

			{logoBase64 ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={logoBase64}
					alt="Adlwise Crest"
					width={120}
					height={120}
					style={{
						borderRadius: "999px",
						marginBottom: "20px",
						border: "2px solid #cea72c",
					}}
				/>
			) : null}

			<div
				style={{
					fontSize: "44px",
					fontWeight: "bold",
					letterSpacing: "0.08em",
					color: "#ffe08e",
					marginBottom: "12px",
				}}
			>
				عدل و حکمت
			</div>

			<div
				style={{
					fontSize: "58px",
					fontWeight: "bold",
					letterSpacing: "0.12em",
					textTransform: "uppercase",
					color: "#ffffff",
					marginBottom: "16px",
				}}
			>
				Adlwise
			</div>

			<div
				style={{
					fontSize: "22px",
					fontStyle: "italic",
					color: "#e8e2d1",
					maxWidth: "800px",
					textAlign: "center",
					lineHeight: 1.4,
				}}
			>
				Justice and Wisdom
			</div>
		</div>,
		{
			...size,
		},
	);
}
