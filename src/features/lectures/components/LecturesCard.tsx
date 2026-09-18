import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Clock } from "lucide-react";
import { LectureItem } from "@/lib/lectures/types";
import { formatDuration } from "@/lib/utils";

interface LecturesCardProps {
	lectures: LectureItem;
}

export function LecturesCard({ lectures }: LecturesCardProps) {
	return (
		<article className="group relative bg-surface-container-low rounded-2xl overflow-hidden border border-surface-container-high hover:border-brand-gold/60 hover:shadow-md hover:cursor-pointer transition-all flex flex-col justify-between h-full">
			{/* Thumbnail Container */}
			<div className="relative w-full aspect-video overflow-hidden bg-primary">
				<Image
					src={lectures.thumbnailUrl}
					alt={lectures.title}
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					className="object-cover group-hover:scale-103 transition-transform duration-500 opacity-95 group-hover:opacity-100"
				/>
				<div className="absolute inset-0 bg-primary/25 group-hover:bg-primary/10 transition-colors" />

				{/* Hover Play Button */}
				<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
					<div className="w-12 h-12 rounded-full bg-brand-gold text-[#00261a] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
						<Play className="w-5 h-5 fill-current ml-0.5" />
					</div>
				</div>
			</div>

			{/* Card Content */}
			<div className="p-5 flex flex-col gap-2">
				<h3 className="font-serif text-lg text-primary font-semibold leading-snug group-hover:text-secondary transition-colors line-clamp-2">
					<Link
						href={`/lectures/${lectures.slug}`}
						className="after:absolute after:inset-0 after:content-[''] focus:outline-none"
					>
						{lectures.title}
					</Link>
				</h3>
			</div>
		</article>
	);
}
