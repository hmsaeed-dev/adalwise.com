"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Search,
	X,
	Loader2,
	ArrowRight,
	Video,
	BookOpen,
	Scale,
	Users,
} from "lucide-react";
import { SearchResult } from "@/lib/search/types";

interface LiveSearchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function LiveSearchModal({ isOpen, onClose }: LiveSearchModalProps) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);

	// Focus input on open
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => inputRef.current?.focus(), 50);
		} else {
			setQuery("");
			setResults([]);
		}
	}, [isOpen]);

	// Handle escape key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				if (isOpen) {
					onClose();
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	// Debounced search fetch
	useEffect(() => {
		if (!query.trim()) {
			setResults([]);
			return;
		}

		setLoading(true);
		const timer = setTimeout(async () => {
			try {
				const res = await fetch(
					`/api/search?q=${encodeURIComponent(query.trim())}`,
				);
				const data = await res.json();
				setResults(data);
			} catch (err) {
				console.error("Live search fetch error:", err);
			} finally {
				setLoading(false);
			}
		}, 250);

		return () => clearTimeout(timer);
	}, [query]);

	if (!isOpen) return null;

	const handleFullSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			onClose();
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-gutter-mobile">
			<div className="bg-surface-container-lowest max-w-2xl w-full rounded-[24px] shadow-2xl border border-surface-container-high overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]">
				{/* Search Input Bar */}
				<form
					onSubmit={handleFullSearch}
					className="flex items-center px-space-md py-space-sm border-b border-surface-container-high gap-space-xs"
				>
					<Search className="w-5 h-5 text-tertiary-container shrink-0" />
					<input
						ref={inputRef}
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search lectures, articles, majlis..."
						className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/60 font-body-md focus:outline-none"
					/>
					{loading && (
						<Loader2 className="w-4 h-4 animate-spin text-outline shrink-0" />
					)}
					<button
						type="button"
						onClick={onClose}
						className="p-1 text-on-surface-variant hover:text-primary rounded-full"
					>
						<X className="w-4 h-4" />
					</button>
				</form>

				{/* Results List */}
				<div className="overflow-y-auto flex-1 p-space-sm divide-y divide-surface-container-high/60">
					{query && results.length === 0 && !loading && (
						<div className="py-space-xl text-center flex flex-col items-center gap-2">
							<Search className="w-8 h-8 text-on-surface-variant/40" />
							<p className="font-body-sm text-on-surface-variant">
								No matching records found for “{query}”
							</p>
						</div>
					)}

					{results.map((item) => (
						<Link
							key={item.id}
							href={item.url}
							onClick={onClose}
							className="p-space-sm rounded-xl hover:bg-surface-container transition-colors flex items-start gap-space-sm group"
						>
							<div className="w-8 h-8 rounded-full bg-surface-container-high text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary-container group-hover:text-surface transition-colors">
								{item.type === "lectures" ? (
									<Video className="w-4 h-4" />
								) : item.type === "article" ? (
									<BookOpen className="w-4 h-4" />
								) : item.type === "dispatch" ? (
									<Scale className="w-4 h-4" />
								) : (
									<Users className="w-4 h-4" />
								)}
							</div>

							<div className="flex-1 min-w-0 flex flex-col gap-0.5">
								<div className="flex items-center justify-between">
									<span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider font-bold">
										{item.type} • {item.category}
									</span>
									{item.meta && (
										<span className="text-[11px] text-on-surface-variant">
											{item.meta}
										</span>
									)}
								</div>
								<h4 className="font-headline-sm text-[15px] text-primary font-bold font-serif line-clamp-1 group-hover:text-secondary transition-colors">
									{item.title}
								</h4>
								{item.urduTitle && (
									<span className="font-urdu text-[12px] text-tertiary font-semibold dir-rtl text-right line-clamp-1">
										{item.urduTitle}
									</span>
								)}
							</div>
						</Link>
					))}
				</div>

				{/* Footer Shortcut Bar */}
				<div className="px-space-md py-space-xs bg-surface-container-low border-t border-surface-container-high flex items-center justify-between text-[11px] text-on-surface-variant">
					<span className="flex items-center gap-1">
						<kbd className="px-1.5 py-0.5 rounded bg-surface border border-surface-container-highest font-mono text-[10px]">
							Esc
						</kbd>{" "}
						to close
					</span>
					{query.trim() && (
						<button
							type="button"
							onClick={handleFullSearch}
							className="text-primary font-semibold hover:underline flex items-center gap-1"
						>
							<span>View all matching results</span>
							<ArrowRight className="w-3.5 h-3.5" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
