"use client";

import React, { useState, useMemo, useCallback } from "react";
import MiniSearch from "minisearch";
import { Search, X, ChevronLeft, ChevronRight, SearchX, ArrowUpDown } from "lucide-react";
import { LectureItem } from "@/lib/lectures/types";
import { PRIMARY_DOMAINS } from "@/lib/taxonomy/registry";
import { LecturesCard } from "./LecturesCard";

interface LecturesArchiveInteractiveProps {
	allLectures: LectureItem[];
	initialParams?: {
		category?: string;
		domain?: string;
		q?: string;
		page?: string;
		series?: string;
		format?: string;
		sort?: string;
	};
}

type SortOption = "newest" | "oldest" | "longest" | "shortest";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
	{ label: "Newest First", value: "newest" },
	{ label: "Oldest First", value: "oldest" },
	{ label: "Long-form (>45m)", value: "longest" },
	{ label: "Concise (<20m)", value: "shortest" },
];

const PAGE_SIZE = 18;

export function LecturesArchiveInteractive({
	allLectures,
	initialParams = {},
}: LecturesArchiveInteractiveProps) {
	// Initialize state from URL params
	const [searchQuery, setSearchQuery] = useState(initialParams.q || "");
	const [selectedDomain, setSelectedDomain] = useState(
		initialParams.domain || initialParams.category?.toLowerCase() || "all",
	);
	const [selectedSort, setSelectedSort] = useState<SortOption>(
		(initialParams.sort as SortOption) || "newest",
	);
	const [selectedSeries, setSelectedSeries] = useState(initialParams.series || "");
	const [currentPage, setCurrentPage] = useState(
		initialParams.page ? parseInt(initialParams.page, 10) : 1,
	);

	// Client-side in-memory MiniSearch index across thematic lectures
	const searchEngine = useMemo(() => {
		const ms = new MiniSearch<LectureItem>({
			fields: ["title", "urduTitle", "description", "topics", "tags", "seriesTitle"],
			storeFields: ["slug"],
			searchOptions: {
				prefix: true,
				fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
				boost: {
					title: 4.0,
					urduTitle: 3.5,
					topics: 2.5,
					seriesTitle: 2.0,
					description: 1.0,
				},
				combineWith: "AND",
			},
		});

		ms.addAll(allLectures);
		return ms;
	}, [allLectures]);

	// In-memory instant filtering and multi-dimensional sorting
	const filteredLectures = useMemo(() => {
		let list = allLectures;

		// 1. Domain Filter
		if (selectedDomain !== "all") {
			const domLower = selectedDomain.toLowerCase();
			list = list.filter((l) => {
				const d = (l.domainId || "").toLowerCase();
				const c = (l.category || "").toLowerCase();
				return d === domLower || c === domLower;
			});
		}

		// 2. Series Filter
		if (selectedSeries) {
			list = list.filter((l) => l.seriesId === selectedSeries);
		}

		// 3. Keyword / MiniSearch Query
		const q = searchQuery.trim();
		if (q) {
			let hits = searchEngine.search(q);
			if (hits.length === 0 && q.includes(" ")) {
				hits = searchEngine.search(q, { combineWith: "OR" });
			}
			const hitRankMap = new Map<string, number>();
			hits.forEach((h, idx) => hitRankMap.set(h.slug, idx));

			list = list
				.filter((l) => hitRankMap.has(l.slug))
				.sort((a, b) => (hitRankMap.get(a.slug) ?? 0) - (hitRankMap.get(b.slug) ?? 0));
		}

		// 4. Multi-dimensional Sorting (if not overridden by search relevance)
		if (!q) {
			list = [...list].sort((a, b) => {
				if (selectedSort === "newest") {
					return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
				}
				if (selectedSort === "oldest") {
					return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
				}
				if (selectedSort === "longest") {
					return (b.durationSeconds || 0) - (a.durationSeconds || 0);
				}
				if (selectedSort === "shortest") {
					return (a.durationSeconds || 0) - (b.durationSeconds || 0);
				}
				return 0;
			});
		}

		return list;
	}, [allLectures, selectedDomain, selectedSeries, searchQuery, selectedSort, searchEngine]);

	// Pagination calculations
	const totalItems = filteredLectures.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
	const safeCurrentPage = Math.min(currentPage, totalPages);

	const paginatedItems = useMemo(() => {
		const start = (safeCurrentPage - 1) * PAGE_SIZE;
		return filteredLectures.slice(start, start + PAGE_SIZE);
	}, [filteredLectures, safeCurrentPage]);

	// Sync browser URL seamlessly without page reload
	const syncUrl = useCallback(
		(params: {
			domain?: string;
			q?: string;
			sort?: string;
			series?: string;
			page?: number;
		}) => {
			if (typeof window === "undefined") return;

			const urlParams = new URLSearchParams();
			if (params.domain && params.domain !== "all") urlParams.set("domain", params.domain);
			if (params.q && params.q.trim()) urlParams.set("q", params.q.trim());
			if (params.sort && params.sort !== "newest") urlParams.set("sort", params.sort);
			if (params.series) urlParams.set("series", params.series);
			if (params.page && params.page > 1) urlParams.set("page", params.page.toString());

			const queryString = urlParams.toString();
			const newRelativePathQuery = queryString ? `/lectures?${queryString}` : `/lectures`;
			window.history.replaceState(null, "", newRelativePathQuery);
		},
		[],
	);

	// Handlers for instant interaction
	const handleDomainChange = (domain: string) => {
		setSelectedDomain(domain);
		setCurrentPage(1);
		syncUrl({
			domain,
			q: searchQuery,
			sort: selectedSort,
			series: selectedSeries,
			page: 1,
		});
	};

	const handleSortChange = (sort: SortOption) => {
		setSelectedSort(sort);
		setCurrentPage(1);
		syncUrl({
			domain: selectedDomain,
			q: searchQuery,
			sort,
			series: selectedSeries,
			page: 1,
		});
	};

	const handleSearchChange = (val: string) => {
		setSearchQuery(val);
		setCurrentPage(1);
		syncUrl({
			domain: selectedDomain,
			q: val,
			sort: selectedSort,
			series: selectedSeries,
			page: 1,
		});
	};

	const handleClearSearch = () => {
		setSearchQuery("");
		setCurrentPage(1);
		syncUrl({
			domain: selectedDomain,
			q: "",
			sort: selectedSort,
			series: selectedSeries,
			page: 1,
		});
	};

	const handleResetAllFilters = () => {
		setSearchQuery("");
		setSelectedDomain("all");
		setSelectedSort("newest");
		setSelectedSeries("");
		setCurrentPage(1);
		syncUrl({});
	};

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
		syncUrl({
			domain: selectedDomain,
			q: searchQuery,
			sort: selectedSort,
			series: selectedSeries,
			page: newPage,
		});

		// Smoothly scroll up to the archive header
		const archiveElem = document.getElementById("archive");
		if (archiveElem) {
			archiveElem.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	const hasActiveFilters =
		selectedDomain !== "all" ||
		selectedSeries !== "" ||
		searchQuery.trim() !== "" ||
		selectedSort !== "newest";

	return (
		<div id="archive" className="w-full flex flex-col scroll-mt-20">
			{/* CONTROLS ZONE: Instant Search & Primary Domain Rail */}
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop pt-10 pb-4 flex flex-col gap-5">
				{/* 1. Instant Search Input */}
				<div className="w-full relative">
					<div className="flex items-center bg-surface-container-lowest px-5 py-3.5 rounded-2xl shadow-sm border border-surface-container-high focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/20 transition-all">
						<Search className="w-4 h-4 text-outline mr-3 shrink-0" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => handleSearchChange(e.target.value)}
							placeholder="Instant search across topics, surahs, or keynotes..."
							className="w-full bg-transparent text-primary placeholder:text-on-surface-variant/60 font-sans text-sm focus:outline-none"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={handleClearSearch}
								title="Clear search"
								className="p-1 text-on-surface-variant hover:text-primary transition-colors ml-2 cursor-pointer"
							>
								<X className="w-4 h-4" />
							</button>
						)}
					</div>
				</div>

				{/* 2. Primary Domain Rail */}
				<div className="flex items-center gap-x-6 gap-y-2 text-sm font-sans overflow-x-auto pb-1.5 sm:flex-wrap scrollbar-none border-b border-surface-container-high/60">
					<button
						type="button"
						onClick={() => handleDomainChange("all")}
						className={`py-2 transition-colors relative font-medium shrink-0 cursor-pointer ${
							selectedDomain === "all"
								? "text-primary font-bold border-b-2 border-brand-gold pb-1.5"
								: "text-on-surface-variant hover:text-primary"
						}`}
					>
						All
					</button>

					{PRIMARY_DOMAINS.map((dom) => {
						const isActive = selectedDomain === dom.slug;
						return (
							<button
								key={dom.id}
								type="button"
								onClick={() => handleDomainChange(dom.slug)}
								className={`py-2 transition-colors relative font-medium shrink-0 cursor-pointer ${
									isActive
										? "text-primary font-bold border-b-2 border-brand-gold pb-1.5"
										: "text-on-surface-variant hover:text-primary"
								}`}
							>
								{dom.title}
							</button>
						);
					})}
				</div>
			</div>

			{/* RESULTS SUMMARY, ACTIVE FILTER RESET & SORT SELECTOR */}
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop pt-1 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
					<span>
						Showing <strong className="text-primary">{paginatedItems.length}</strong> of{" "}
						<strong className="text-primary">{totalItems}</strong> Lectures
					</span>
					{selectedSeries && (
						<span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold rounded-md border border-brand-gold/20 font-semibold">
							Series Filter Active
						</span>
					)}
					{hasActiveFilters && (
						<button
							type="button"
							onClick={handleResetAllFilters}
							className="text-xs text-secondary hover:text-primary font-semibold hover:underline transition-colors ml-1 cursor-pointer"
						>
							Reset
						</button>
					)}
				</div>

				{/* Multi-Dimensional Sorting Selector */}
				<div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
					<select
						id="sort-select"
						value={selectedSort}
						onChange={(e) => handleSortChange(e.target.value as SortOption)}
						className="bg-surface-container-low hover:bg-surface-container text-primary font-sans text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-brand-gold cursor-pointer transition-colors"
					>
						{SORT_OPTIONS.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* HOLDINGS GRID */}
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop pb-16">
				{paginatedItems.length === 0 ? (
					<div className="py-16 px-4 text-center flex flex-col items-center justify-center gap-4 bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 my-4 shadow-xs">
						<SearchX className="w-12 h-12 text-on-surface-variant/40" />
						<div className="flex flex-col items-center gap-1.5">
							<h3 className="font-headline-md text-primary font-bold text-lg sm:text-xl">
								No Lectures Found
							</h3>
							<p className="font-body-sm text-on-surface-variant max-w-md text-xs sm:text-sm">
								No matches for your search:
							</p>
						</div>

						<div className="flex flex-wrap justify-center gap-2 max-w-lg pt-1">
							{PRIMARY_DOMAINS.map((d) => (
								<button
									key={d.slug}
									type="button"
									onClick={() => {
										setSearchQuery("");
										handleDomainChange(d.slug);
									}}
									className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-container hover:bg-surface-container-high text-primary border border-surface-container-highest transition-colors cursor-pointer"
								>
									{d.title}
								</button>
							))}
						</div>

						<button
							type="button"
							onClick={handleResetAllFilters}
							className="mt-2 px-5 py-2 bg-primary text-on-primary text-xs font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
						>
							Reset
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
						{paginatedItems.map((lecture) => (
							<LecturesCard key={lecture.slug} lectures={lecture} />
						))}
					</div>
				)}

				{/* INSTANT ZERO-LATENCY PAGINATION */}
				{totalPages > 1 && (
					<nav
						aria-label="Catalog pagination"
						className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-10"
					>
						{safeCurrentPage > 1 ? (
							<button
								type="button"
								onClick={() => handlePageChange(safeCurrentPage - 1)}
								className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-primary rounded-full text-xs font-semibold transition-colors border border-surface-container-highest flex items-center gap-1 cursor-pointer shadow-sm"
							>
								<ChevronLeft className="w-4 h-4" />
							</button>
						) : (
							<span className="px-4 py-2 bg-surface-container/40 text-on-surface-variant/40 rounded-full text-xs font-semibold cursor-not-allowed border border-surface-container-highest/40 flex items-center gap-1 select-none">
								<ChevronLeft className="w-4 h-4" />
							</span>
						)}

						<div className="flex items-center gap-1.5 text-xs font-semibold text-primary px-3.5 py-1.5 bg-surface-container-low rounded-full border border-surface-container-high shadow-sm">
							<span>Page</span>
							<span className="font-bold text-secondary">{safeCurrentPage}</span>
							<span className="text-on-surface-variant/70">of</span>
							<span>{totalPages}</span>
						</div>

						{safeCurrentPage < totalPages ? (
							<button
								type="button"
								onClick={() => handlePageChange(safeCurrentPage + 1)}
								className="px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-full text-xs font-semibold transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
							>
								<ChevronRight className="w-4 h-4" />
							</button>
						) : (
							<span className="px-4 py-2 bg-surface-container/40 text-on-surface-variant/40 rounded-full text-xs font-semibold cursor-not-allowed border border-surface-container-highest/40 flex items-center gap-1 select-none">
								<ChevronRight className="w-4 h-4" />
							</span>
						)}
					</nav>
				)}
			</div>
		</div>
	);
}
