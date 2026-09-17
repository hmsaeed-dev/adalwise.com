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
	const [selectedIndex, setSelectedIndex] = useState<number>(-1);
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const resultsContainerRef = useRef<HTMLDivElement>(null);

	// Reset state and focus input when modal opens/closes
	useEffect(() => {
		if (isOpen) {
			setSelectedIndex(-1);
			setTimeout(() => inputRef.current?.focus(), 50);
		} else {
			setQuery("");
			setResults([]);
			setSelectedIndex(-1);
			setLoading(false);
		}
	}, [isOpen]);

	// Global keyboard shortcuts (Escape, Ctrl+K)
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

	// Auto-scroll selected item into view
	useEffect(() => {
		if (selectedIndex >= 0 && resultsContainerRef.current) {
			const activeEl = resultsContainerRef.current.children[selectedIndex] as HTMLElement;
			if (activeEl) {
				activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
			}
		}
	}, [selectedIndex]);

	// Debounced search fetch with AbortController to prevent out-of-order race conditions
	useEffect(() => {
		if (!query.trim()) {
			setResults([]);
			setSelectedIndex(-1);
			setLoading(false);
			return;
		}

		setLoading(true);
		const controller = new AbortController();

		const timer = setTimeout(async () => {
			try {
				const res = await fetch(
					`/api/search?q=${encodeURIComponent(query.trim())}`,
					{ signal: controller.signal },
				);
				if (!res.ok) throw new Error("Search request failed");
				const data: SearchResult[] = await res.json();
				setResults(data);
				setSelectedIndex(-1);
			} catch (err: any) {
				if (err.name !== "AbortError") {
					console.error("Live search fetch error:", err);
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		}, 220);

		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [query]);

	if (!isOpen) return null;

	const handleFullSearch = (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (query.trim()) {
			onClose();
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	};

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			if (results.length > 0) {
				setSelectedIndex((prev) => (prev + 1) % results.length);
			}
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			if (results.length > 0) {
				setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
			}
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (selectedIndex >= 0 && results[selectedIndex]) {
				onClose();
				router.push(results[selectedIndex].url);
			} else {
				handleFullSearch();
			}
		}
	};

	const clearQuery = () => {
		setQuery("");
		setResults([]);
		setSelectedIndex(-1);
		inputRef.current?.focus();
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
						onKeyDown={handleInputKeyDown}
						placeholder="Search lectures, articles, majlis..."
						className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/60 font-body-md focus:outline-none"
					/>
					{loading && (
						<Loader2 className="w-4 h-4 animate-spin text-brand-gold shrink-0" />
					)}
					{query && (
						<button
							type="button"
							onClick={clearQuery}
							title="Clear search"
							className="p-1 text-on-surface-variant hover:text-primary rounded-full transition-colors"
						>
							<X className="w-4 h-4" />
						</button>
					)}
					<button
						type="button"
						onClick={onClose}
						aria-label="Close search"
						className="p-1 text-on-surface-variant hover:text-primary rounded-full transition-colors ml-1"
					>
						<span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-surface-container border border-surface-container-high hidden sm:inline">
							ESC
						</span>
					</button>
				</form>

				{/* Results List */}
				<div
					ref={resultsContainerRef}
					className="overflow-y-auto flex-1 p-space-sm divide-y divide-surface-container-high/60"
				>
					{query && results.length === 0 && !loading && (
						<div className="py-space-xl text-center flex flex-col items-center gap-2">
							<Search className="w-8 h-8 text-on-surface-variant/40" />
							<p className="font-body-sm text-on-surface-variant">
								No matching records found for “{query}”
							</p>
						</div>
					)}

					{results.map((item, idx) => {
						const isSelected = selectedIndex === idx;

						return (
							<Link
								key={item.id}
								href={item.url}
								onClick={onClose}
								onMouseEnter={() => setSelectedIndex(idx)}
								className={`p-space-sm rounded-xl transition-all flex items-start gap-space-sm group ${
									isSelected
										? "bg-surface-container border-l-4 border-brand-gold shadow-xs"
										: "hover:bg-surface-container/60"
								}`}
							>
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
										isSelected
											? "bg-primary text-brand-warm-white"
											: "bg-surface-container-high text-primary group-hover:bg-primary group-hover:text-brand-warm-white"
									}`}
								>
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
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-1.5 truncate">
											<span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider font-bold">
												{item.type} • {item.category}
											</span>
											{item.isCoursework && (
												<span className="font-sans text-[9px] uppercase tracking-wider font-semibold bg-secondary/15 text-secondary px-1.5 py-0.2 rounded">
													Coursework
												</span>
											)}
										</div>
										{item.meta && (
											<span className="text-[11px] text-on-surface-variant/80 shrink-0 font-sans">
												{item.meta}
											</span>
										)}
									</div>
									<h4 className="font-headline-sm text-[15px] text-primary font-bold line-clamp-1 group-hover:text-secondary transition-colors">
										{item.title}
									</h4>
									{item.urduTitle && (
										<span className="font-urdu text-[12px] text-tertiary font-semibold dir-rtl text-right line-clamp-1">
											{item.urduTitle}
										</span>
									)}
								</div>
							</Link>
						);
					})}
				</div>

				{/* Footer Shortcut Bar */}
				<div className="px-space-md py-space-xs bg-surface-container-low border-t border-surface-container-high flex flex-wrap items-center justify-between gap-2 text-[11px] text-on-surface-variant">
					<div className="flex items-center gap-3 text-on-surface-variant/70">
						<span className="hidden sm:inline-flex items-center gap-1">
							<kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-surface-container-high font-mono text-[10px]">
								↑↓
							</kbd>
							<span>Navigate</span>
						</span>
						<span className="hidden sm:inline-flex items-center gap-1">
							<kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-surface-container-high font-mono text-[10px]">
								↵
							</kbd>
							<span>Select</span>
						</span>
						<span className="hidden sm:inline-flex items-center gap-1">
							<kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-surface-container-high font-mono text-[10px]">
								Esc
							</kbd>
							<span>Close</span>
						</span>
					</div>

					{query.trim() && (
						<button
							type="button"
							onClick={() => handleFullSearch()}
							className="text-primary font-semibold hover:underline flex items-center gap-1 ml-auto"
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
