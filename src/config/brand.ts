/**
 * Adlwise Brand Design Tokens
 * 
 * Single source of truth for core brand colors, typography tokens,
 * and aesthetic constants. Used across Tailwind, CSS Custom Properties,
 * and OpenGraph image renderers.
 */

export const brandColors = {
	primary: {
		DEFAULT: "#143826", // Deep Forest Green (Main Brand Anchor)
		hover: "#0e2c1d", // Darker Forest for Hover States
		container: "#1f4a35", // Tinted Forest Container
		rgb: "20 56 38",
		hoverRgb: "14 44 29",
	},
	gold: {
		DEFAULT: "#B88E3F", // Muted Antique Gold (Calligraphy & Accents)
		light: "#D4AF37", // Warm Gold Highlight
		dark: "#9E782E", // Deep Bronze/Gold
		rgb: "184 142 63",
	},
	charcoal: {
		DEFAULT: "#2A3A30", // Editorial Body Subtext
		muted: "#47594E", // Secondary Muted Subtext
		rgb: "42 58 48",
	},
	warmWhite: {
		DEFAULT: "#FAF8F5", // Warm Off-White (Button text, highlights)
		surface: "#FFF9E9", // Classical Parchment Page Surface
		rgb: "250 248 245",
	},
	parchment: {
		DEFAULT: "#ede6d9", // High-altitude morning sky / paper fallback
		rgb: "237 230 217",
	},
} as const;

export const brandTypography = {
	tracking: {
		editorial: "0.25em", // Spaced display caps for ADLWISE
	},
} as const;
