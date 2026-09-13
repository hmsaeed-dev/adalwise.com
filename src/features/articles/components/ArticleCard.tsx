import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ArticleDoc } from "@/lib/content/schemas";
import { formatISODate } from "@/lib/utils";

interface ArticleCardProps {
	article: ArticleDoc;
}

export function ArticleCard({ article }: ArticleCardProps) {
	const { frontmatter, slug } = article;

	return (
		<article className="group bg-surface-container-lowest rounded-[22px] overflow-hidden border border-surface-container-high shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col">
			<Link
				href={`/twasi-al-haq/${slug}`}
				className="relative w-full h-48 overflow-hidden bg-primary-container block"
			>
				{frontmatter.coverImage ? (
					<Image
						src={frontmatter.coverImage}
						alt={frontmatter.title}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-primary via-[#00261a] to-[#00170f] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-tertiary-container/15 via-transparent to-transparent" />
						<div className="relative w-16 h-16 rounded-full bg-primary/80 ring-1 ring-tertiary-container/30 flex items-center justify-center p-2 opacity-80 group-hover:opacity-100 transition-opacity">
							<Image
									src="/images/assets/mountain-mark.png"
								alt="Adlwise Emblem"
								width={48}
								height={48}
								className="object-contain"
							/>
						</div>
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent pointer-events-none" />
				<div className="absolute top-3 left-3 px-space-xs py-0.5 rounded-full bg-primary/80 backdrop-blur-sm text-tertiary-fixed text-[10px] font-label-sm uppercase tracking-wider font-bold">
					{frontmatter.category}
				</div>
			</Link>

			<div className="p-space-md flex flex-col flex-1 gap-space-2xs">
				<div className="flex items-center justify-between text-[11px] text-on-surface-variant">
					<span>{frontmatter.author.name}</span>
					<span>
						{frontmatter.readTime} •{" "}
						{formatISODate(frontmatter.publishedAt)}
					</span>
				</div>

				<h3 className="font-headline-sm text-primary font-bold leading-snug group-hover:text-primary-container transition-colors line-clamp-2">
					<Link href={`/twasi-al-haq/${slug}`}>
						{frontmatter.title}
					</Link>
				</h3>

				{frontmatter.urduTitle && (
					<p className="font-urdu text-[14px] text-tertiary font-semibold dir-rtl text-right line-clamp-1 -mt-1">
						{frontmatter.urduTitle}
					</p>
				)}

				<p className="font-body-sm text-on-surface-variant line-clamp-3 leading-relaxed mt-1">
					{frontmatter.excerpt}
				</p>

				<div className="pt-space-xs mt-auto flex items-center justify-between border-t border-surface-container-high/60 text-[11px]">
					<span className="font-label-sm uppercase tracking-wider text-secondary font-bold">
						{frontmatter.category}
					</span>
					<Link
						href={`/twasi-al-haq/${slug}`}
						className="text-primary font-semibold hover:underline flex items-center gap-1"
					>
						<span>Read</span>
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>
			</div>
		</article>
	);
}
