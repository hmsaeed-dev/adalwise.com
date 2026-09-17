"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
	FileText,
	Clock,
} from "lucide-react";
import MiniSearch from "minisearch";
import { SearchResult } from "@/lib/search/types";
import { normalizeUrduArabic, tokenizeBilingual } from "@/lib/search/normalizer";
import { resolveQuranNotation } from "@/lib/search/quran-notation";
import type { ClientSearchItem } from "@/lib/search/minisearch-provider";

interface LiveSearchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

// Module-level cached client index for 0ms keystroke search across dialog opens
let clientMiniSearchInstance: MiniSearch<ClientSearchItem> | null = null;
let clientCatalogList: ClientSearchItem[] | null = null;
let isPreloading = false;

export function LiveSearchModal({ isOpen, onClose }: LiveSearchModalProps) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState<number>(-1);
	const [recentSearches, setRecentSearches] = useState<string[]>([]);

	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const resultsContainerRef = useRef<HTMLDivElement>(null);

	// Load recent searches from localStorage
	useEffect(() => {
		if (isOpen && typeof window !== "undefined") {
			try {
				const saved = localStorage.getItem("adlwise_recent_searches");
				if (saved) {
					setRecentSearches(JSON.parse(saved).slice(0, 4));
				}
			} catch {
				// ignore localStorage errors
			}
		}
	}, [isOpen]);

	const saveRecentSearch = useCallback((term: string) => {
		const clean = term.trim();
		if (!clean || typeof window === "undefined") return;
		try {
			const saved = localStorage.getItem("adlwise_recent_searches");
			const list: string[] = saved ? JSON.parse(saved) : [];
			const updated = [
				clean,
				...list.filter((x) => x.toLowerCase() !== clean.toLowerCase()),
			].slice(0, 4);
			localStorage.setItem("adlwise_recent_searches", JSON.stringify(updated));
			setRecentSearches(updated);
		} catch {
			// ignore localStorage errors
		}
	}, []);

	const clearRecentSearches = () => {
		if (typeof window === "undefined") return;
		try {
			localStorage.removeItem("adlwise_recent_searches");
			setRecentSearches([]);
		} catch {
			// ignore
		}
	};

	// Pre-cache catalog for 0ms client-side search
	useEffect(() => {
		if (isOpen && !clientCatalogList && !isPreloading) {
			isPreloading = true;
			fetch("/api/search/catalog")
				.then((res) => (res.ok ? res.json() : null))
				.then((data: ClientSearchItem[] | null) => {
					if (data && Array.isArray(data)) {
						clientCatalogList = data;
						const ms = new MiniSearch<ClientSearchItem>({
							fields: ["title", "urduTitle", "category", "meta", "slug"],
							storeFields: [
								"id",
								"type",
								"title",
								"urduTitle",
								"url",
								"category",
								"meta",
								"isCoursework",
								"slug",
							],
							tokenize: tokenizeBilingual,
							processTerm: (term) => normalizeUrduArabic(term),
							searchOptions: {
								boost: {
									title: 4.0,
									urduTitle: 3.5,
									category: 1.8,
									meta: 1.2,
								},
								prefix: true,
								fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
								combineWith: "AND",
							},
						});
						ms.addAll(data);
						clientMiniSearchInstance = ms;
					}
				})
				.catch((err) => console.warn("Catalog preload notice:", err))
				.finally(() => {
					isPreloading = false;
				});
		}
	}, [isOpen]);

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
			const activeEl = resultsContainerRef.current.children[
				selectedIndex
			] as HTMLElement;
			if (activeEl) {
				activeEl.scrollIntoView({
					block: "nearest",
					behavior: "smooth",
				});
			}
		}
	}, [selectedIndex]);

	// Search execution: 0ms client-side MiniSearch when cached, falling back to server route
	useEffect(() => {
		const trimmed = query.trim();
		if (!trimmed) {
			setResults([]);
			setSelectedIndex(-1);
			setLoading(false);
			return;
		}

		// 1. Instant 0ms Client-Side Search if index is ready
		if (clientMiniSearchInstance) {
			const cleanQ = normalizeUrduArabic(trimmed);
			const quranTerms = resolveQuranNotation(trimmed);

			const hasCourseworkIntent =
				/\b(dora|daura|tarjuma|session|sitting|dars|course|juz|para|\d+)\b/i.test(cleanQ) ||
				/(دورہ|دورۂ|ترجمہ|نشست|درس|پارہ|جزء)/.test(cleanQ);

			const boostDocument = (
				_id: string,
				_term: string,
				storedFields?: Record<string, unknown>,
			) => {
				if (!storedFields?.isCoursework) return 1.0;
				return hasCourseworkIntent ? 1.15 : 0.35;
			};

			let raw = clientMiniSearchInstance.search(cleanQ, {
				boostDocument,
				combineWith: "AND",
				prefix: true,
				fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
			});

			// Notation fallback if direct search yielded 0
			if (raw.length === 0 && quranTerms.length > 0) {
				const notationQuery = quranTerms.map(normalizeUrduArabic).join(" ");
				raw = clientMiniSearchInstance.search(notationQuery, {
					boostDocument,
					combineWith: "OR",
					prefix: true,
					fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
				});
			}

			// Soft fallback if multi-word query returned 0
			let isRelaxed = false;
			if (raw.length === 0 && cleanQ.includes(" ")) {
				raw = clientMiniSearchInstance.search(cleanQ, {
					boostDocument,
					combineWith: "OR",
					prefix: true,
					fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
				});
				if (raw.length > 0) {
					isRelaxed = true;
				}
			}

			const mappedResults: SearchResult[] = raw.slice(0, 8).map((hit) => ({
				id: hit.id,
				type: hit.type,
				title: hit.title,
				urduTitle: hit.urduTitle,
				url: hit.url,
				category: hit.category,
				meta: hit.meta,
				isCoursework: hit.isCoursework,
				slug: hit.slug,
				excerpt: "",
				tags: [],
				date: "",
				isRelaxedMatch: isRelaxed,
			}));

			setResults(mappedResults);
			setSelectedIndex(-1);
			setLoading(false);
			return;
		}

		// 2. Server-side fallback if client index is still loading
		setLoading(true);
		const controller = new AbortController();

		const timer = setTimeout(async () => {
			try {
				const res = await fetch(
					`/api/search?q=${encodeURIComponent(trimmed)}`,
					{ signal: controller.signal },
				);
				if (!res.ok) throw new Error("Search request failed");
				const data: SearchResult[] = await res.json();
				setResults(data);
				setSelectedIndex(-1);
			} catch (err: unknown) {
				if (err instanceof Error && err.name !== "AbortError") {
					console.error("Live search fetch error:", err);
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		}, 100);

		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [query]);

	if (!isOpen) return null;

	const handleFullSearch = (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (query.trim()) {
			saveRecentSearch(query);
			onClose();
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	};

	const handleSelectResult = (item: SearchResult) => {
		saveRecentSearch(item.title || query);
		onClose();
		router.push(item.url);
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
				setSelectedIndex(
					(prev) => (prev - 1 + results.length) % results.length,
				);
			}
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (selectedIndex >= 0 && results[selectedIndex]) {
				handleSelectResult(results[selectedIndex]);
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
					className="flex items-center px-space-md py-space-sm border-surface-container-high gap-space-xs"
				>
					<Search className="w-5 h-5 text-tertiary-container shrink-0" />
					<input
						ref={inputRef}
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={handleInputKeyDown}
						placeholder="Search lectures, articles, surahs (e.g. 2:255)..."
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

				{/* Results / Empty State Container */}
				<div
					ref={resultsContainerRef}
					className="overflow-y-auto flex-1 p-space-sm divide-y divide-surface-container-high/60"
				>
					{/* Empty State: Recent Searches & Suggested Inquiries */}
					{!query.trim() && (
						<div className="p-space-md flex flex-col gap-space-md">
							{recentSearches.length > 0 && (
								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-between text-[11px] font-bold text-secondary uppercase tracking-wider">
										<span className="flex items-center gap-1">
											<Clock className="w-3 h-3" />
											<span>Recent Searches</span>
										</span>
										<button
											type="button"
											onClick={clearRecentSearches}
											className="text-[11px] text-on-surface-variant/60 hover:text-primary transition-colors lowercase tracking-normal font-normal"
										>
											clear
										</button>
									</div>
									<div className="flex flex-wrap gap-1.5">
										{recentSearches.map((term) => (
											<button
												key={term}
												type="button"
												onClick={() => setQuery(term)}
												className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs text-primary font-medium transition-colors"
											>
												{term}
											</button>
										))}
									</div>
								</div>
							)}

							<div className="flex flex-col gap-2">
								<span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
									Suggested Inquiries
								</span>
								<div className="flex flex-wrap gap-1.5">
									{[
										"Charter of Medina",
										"Quran & Justice",
										"Iqbalian Thought",
										"Surah Al-Asr",
									].map((topic) => (
										<button
											key={topic}
											type="button"
											onClick={() => setQuery(topic)}
											className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs text-on-surface-variant hover:text-primary transition-colors"
										>
											{topic}
										</button>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Soft Fallback Notice */}
					{results.length > 0 && results[0]?.isRelaxedMatch && (
						<div className="px-3 py-2 text-[11px] text-secondary font-medium tracking-wide">
							No exact match for all words. Showing closest matching holdings:
						</div>
					)}

					{/* No Results Fallback */}
					{query && results.length === 0 && !loading && (
						<div className="py-space-xl text-center flex flex-col items-center gap-1.5">
							<Search className="w-8 h-8 text-on-surface-variant/40 mb-1" />
							<p className="font-body-sm text-on-surface font-medium">
								No matching records found for “{query}”
							</p>
							<p className="text-xs text-on-surface-variant/70 max-w-xs">
								Try searching for broader keywords, Surah notations (e.g. 2:255), or concepts.
							</p>
						</div>
					)}

					{/* Results List */}
					{results.map((item, idx) => {
						const isSelected = selectedIndex === idx;

						return (
							<Link
								key={item.id}
								href={item.url}
								onClick={() => handleSelectResult(item)}
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
									) : item.type === "note" ? (
										<FileText className="w-4 h-4" />
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
				<div className="px-space-md py-space-xs bg-surface-container-low border-surface-container-high flex flex-wrap items-center justify-between gap-2 text-[11px] text-on-surface-variant">
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
