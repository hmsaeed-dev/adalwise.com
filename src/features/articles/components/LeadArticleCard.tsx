import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { ArticleDoc } from "@/lib/content/schemas";
import { formatISODate } from "@/lib/utils";

interface LeadArticleCardProps {
	article: ArticleDoc;
}

export function LeadArticleCard({ article }: LeadArticleCardProps) {
	const { frontmatter, slug } = article;

	return (
		<section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-md max-w-container-max mx-auto">
			<div className="bg-primary text-surface rounded-[24px] p-space-lg md:p-space-xl shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-space-lg border border-primary-container">
				{/* Optional Cover Image */}
				{frontmatter.coverImage && (
					<div className="relative w-full md:w-2/5 min-h-[220px] rounded-[18px] overflow-hidden bg-primary-container shrink-0">
						<Image
							src={frontmatter.coverImage}
							alt={frontmatter.title}
							fill
							priority
							className="object-cover opacity-90 hover:scale-105 transition-transform duration-500"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent pointer-events-none" />
					</div>
				)}

				<div className="flex flex-col justify-between flex-1 gap-space-md">
					<div className="flex flex-col gap-space-xs">
						<div className="flex items-center gap-space-xs">
							<span className="px-space-xs py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-label-sm text-[10px] uppercase tracking-wider font-bold">
								{frontmatter.category}
							</span>
							<span className="text-surface-variant font-label-sm text-[11px]">
								{frontmatter.readTime} • {formatISODate(frontmatter.publishedAt)}
							</span>
						</div>

						<h2 className="font-display-lg text-[26px] sm:text-[32px] text-surface leading-tight font-bold font-serif mt-1">
							<Link href={`/twasi-al-haq/${slug}`} className="hover:text-tertiary-fixed transition-colors">
								{frontmatter.title}
							</Link>
						</h2>

						{frontmatter.urduTitle && (
							<p className="font-urdu text-[20px] text-tertiary-fixed dir-rtl text-right font-bold mt-0.5">
								{frontmatter.urduTitle}
							</p>
						)}

						<p className="font-body-md text-surface-variant leading-relaxed line-clamp-3 mt-1">
							{frontmatter.excerpt}
						</p>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pt-space-xs border-t border-primary-container">
						<div className="flex items-center gap-2 text-surface-variant text-xs font-sans">
							<BookOpen className="w-4 h-4 text-tertiary-fixed" />
							<span>By {frontmatter.author.name}</span>
						</div>

						<Link
							href={`/twasi-al-haq/${slug}`}
							className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-fixed font-label-md uppercase tracking-wider font-semibold rounded-full shadow transition-all self-start sm:self-auto"
						>
							<span>Read Treatise</span>
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
