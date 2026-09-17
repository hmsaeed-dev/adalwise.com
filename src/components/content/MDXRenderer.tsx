import React from "react";
import Link from "next/link";

interface MDXRendererProps {
	content: string;
}

// Formats inline markdown elements: **bold**, *italic*, `code`, [link](url)
function formatInline(text: string): React.ReactNode[] {
	const parts: React.ReactNode[] = [];
	const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
	let lastIdx = 0;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIdx) {
			parts.push(text.slice(lastIdx, match.index));
		}
		const token = match[0];
		if (token.startsWith("**") && token.endsWith("**")) {
			parts.push(
				<strong key={match.index} className="font-bold text-primary">
					{token.slice(2, -2)}
				</strong>,
			);
		} else if (token.startsWith("*") && token.endsWith("*")) {
			parts.push(
				<em key={match.index} className="italic font-serif">
					{token.slice(1, -1)}
				</em>,
			);
		} else if (token.startsWith("`") && token.endsWith("`")) {
			parts.push(
				<code
					key={match.index}
					className="px-1.5 py-0.5 rounded bg-surface-container text-primary font-mono text-[13px] border border-surface-container-high"
				>
					{token.slice(1, -1)}
				</code>,
			);
		} else if (token.startsWith("[")) {
			const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
			if (linkMatch) {
				parts.push(
					<Link
						key={match.index}
						href={linkMatch[2]}
						className="text-primary font-semibold underline underline-offset-4 decoration-tertiary-container hover:text-secondary transition-colors"
					>
						{linkMatch[1]}
					</Link>,
				);
			}
		}
		lastIdx = regex.lastIndex;
	}

	if (lastIdx < text.length) {
		parts.push(text.slice(lastIdx));
	}

	return parts.length > 0 ? parts : [text];
}

export function MDXRenderer({ content }: MDXRendererProps) {
	const paragraphs = content.split(/\n\n+/);

	return (
		<div className="flex flex-col gap-space-md text-[16px] sm:text-[17px] leading-relaxed text-on-surface">
			{paragraphs.map((block, idx) => {
				const trimmed = block.trim();

				// Heading 2
				if (trimmed.startsWith("## ")) {
					const title = trimmed.replace(/^##\s+/, "");
					return (
						<h2
							key={idx}
							className="font-headline-lg text-primary font-bold mt-space-lg mb-space-xs  border-surface-container-high pb-2"
						>
							{title}
						</h2>
					);
				}

				// Heading 3
				if (trimmed.startsWith("### ")) {
					const title = trimmed.replace(/^###\s+/, "");
					return (
						<h3
							key={idx}
							className="font-headline-md text-primary font-semibold mt-space-md mb-space-2xs"
						>
							{title}
						</h3>
					);
				}

				// Blockquote
				if (trimmed.startsWith(">")) {
					const quoteLines = trimmed
						.split("\n")
						.map((line) => line.replace(/^>\s?/, ""))
						.join("\n");

					return (
						<blockquote
							key={idx}
							className="border-l-4 border-tertiary-container pl-space-md py-space-sm my-space-sm bg-surface-container-low/80 rounded-r-2xl italic font-serif text-primary"
						>
							{quoteLines.split("\n").map((line, lIdx) => (
								<p key={lIdx} className="leading-relaxed">
									{formatInline(line)}
								</p>
							))}
						</blockquote>
					);
				}

				// Code block
				if (trimmed.startsWith("```")) {
					const codeContent = trimmed.replace(
						/```[a-z]*\n?|```$/g,
						"",
					);
					return (
						<pre
							key={idx}
							className="p-space-md rounded-2xl bg-primary text-surface font-mono text-[13px] overflow-x-auto my-space-sm border border-primary-container shadow-inner"
						>
							<code>{codeContent}</code>
						</pre>
					);
				}

				// Unordered List
				if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
					const items = trimmed
						.split("\n")
						.map((line) => line.replace(/^[-*]\s+/, ""));
					return (
						<ul
							key={idx}
							className="flex flex-col gap-2 my-space-xs pl-space-md"
						>
							{items.map((item, itemIdx) => (
								<li
									key={itemIdx}
									className="flex items-start gap-space-xs"
								>
									<span className="text-tertiary-container font-bold mt-1 select-none">
										♦
									</span>
									<div className="flex-1">
										{formatInline(item)}
									</div>
								</li>
							))}
						</ul>
					);
				}

				// Ordered List
				if (/^\d+\.\s/.test(trimmed)) {
					const items = trimmed
						.split("\n")
						.map((line) => line.replace(/^\d+\.\s+/, ""));
					return (
						<ol
							key={idx}
							className="flex flex-col gap-2 my-space-xs pl-space-md list-decimal"
						>
							{items.map((item, itemIdx) => (
								<li
									key={itemIdx}
									className="leading-relaxed pl-1"
								>
									{formatInline(item)}
								</li>
							))}
						</ol>
					);
				}

				// Standard Paragraph
				return (
					<p key={idx} className="leading-relaxed">
						{formatInline(trimmed)}
					</p>
				);
			})}
		</div>
	);
}
