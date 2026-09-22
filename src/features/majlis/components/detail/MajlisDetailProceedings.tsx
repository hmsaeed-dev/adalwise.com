import React from "react";
import { MDXRenderer } from "@/components/content/MDXRenderer";

interface MajlisDetailProceedingsProps {
	content: string;
}

export function MajlisDetailProceedings({
	content,
}: MajlisDetailProceedingsProps) {
	if (!content || content.trim().length === 0) return null;

	return (
		<section aria-labelledby="prose-heading" className="pt-2">
			<h2 id="prose-heading" className="sr-only">
				Deliberation Proceedings &amp; Text
			</h2>
			<div className="prose prose-lg max-w-none text-on-surface/90">
				<MDXRenderer content={content} />
			</div>
		</section>
	);
}
