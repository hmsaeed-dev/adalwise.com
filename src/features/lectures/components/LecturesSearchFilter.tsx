"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { PRIMARY_DOMAINS } from "@/lib/taxonomy/registry";

export function LecturesSearchFilter() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const currentDomain = searchParams.get("domain") || "all";
	const currentSubCategory = searchParams.get("subCategory") || "all";
	const currentQueryParam = searchParams.get("q") || "";
	const isCourseworkIncluded = searchParams.get("coursework") === "true";
	const [searchTerm, setSearchTerm] = useState(currentQueryParam);

	// Sync local search term if URL param changes externally
	useEffect(() => {
		setSearchTerm(currentQueryParam);
	}, [currentQueryParam]);

	const executeSearch = (term: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (term.trim()) {
			params.set("q", term.trim());
		} else {
			params.delete("q");
		}
		params.set("page", "1");
		startTransition(() => {
			router.replace(`/lectures?${params.toString()}`, { scroll: false });
		});
	};

	// Debounced search query update
	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchTerm === currentQueryParam) return;
			executeSearch(searchTerm);
		}, 250);

		return () => clearTimeout(timer);
	}, [searchTerm, currentQueryParam, searchParams, router]);

	const handleSubmitSearch = (e: React.FormEvent) => {
		e.preventDefault();
		executeSearch(searchTerm);
	};

	const handleDomainSelect = (domainSlug: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (domainSlug === "all") {
			params.delete("domain");
			params.delete("subCategory");
		} else {
			params.set("domain", domainSlug);
			params.delete("subCategory"); // reset sub-category when changing domain
		}
		params.set("page", "1");
		startTransition(() => {
			router.replace(`/lectures?${params.toString()}`, { scroll: false });
		});
	};

	const handleSubCategorySelect = (subSlug: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (subSlug === "all") {
			params.delete("subCategory");
		} else {
			params.set("subCategory", subSlug);
		}
		params.set("page", "1");
		startTransition(() => {
			router.replace(`/lectures?${params.toString()}`, { scroll: false });
		});
	};

	const handleToggleCoursework = () => {
		const params = new URLSearchParams(searchParams.toString());
		if (isCourseworkIncluded) {
			params.delete("coursework");
		} else {
			params.set("coursework", "true");
		}
		params.set("page", "1");
		startTransition(() => {
			router.replace(`/lectures?${params.toString()}`, { scroll: false });
		});
	};

	const clearSearch = () => {
		setSearchTerm("");
		const params = new URLSearchParams(searchParams.toString());
		params.delete("q");
		params.set("page", "1");
		startTransition(() => {
			router.replace(`/lectures?${params.toString()}`, { scroll: false });
		});
	};

	// Find currently active domain to render progressive disclosure sub-categories
	const activeDomainObj = PRIMARY_DOMAINS.find((d) => d.slug === currentDomain);

	return (
		<div
			id="archive"
			className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop pt-10 pb-6 flex flex-col gap-6 scroll-mt-24"
		>
			{/* Section Masthead */}
			<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4">
				<div>
					<h3 className="font-serif text-2xl sm:text-4xl text-primary font-bold">
						Search &amp; Filter
					</h3>
				</div>
			</div>

			{/* Search Input Bar (High Contrast, Clean Editorial Design) */}
			<form onSubmit={handleSubmitSearch} className="w-full relative">
				<div className="flex items-center bg-surface-container-lowest px-5 py-3.5 rounded-2xl shadow-sm focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/20 transition-all">
					{isPending ? (
						<Loader2 className="w-4 h-4 text-brand-gold animate-spin mr-3 shrink-0" />
					) : (
						<Search className="w-4 h-4 text-outline mr-3 shrink-0" />
					)}
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search surahs, constitutional terms, topics (e.g. Medina, Usul, Khudi)..."
						className="w-full bg-transparent text-primary placeholder:text-on-surface-variant/60 font-sans text-sm focus:outline-none"
					/>
					{searchTerm && (
						<button
							type="button"
							onClick={clearSearch}
							title="Clear search"
							className="p-1 text-on-surface-variant hover:text-primary transition-colors ml-2"
						>
							<X className="w-4 h-4" />
						</button>
					)}
				</div>
			</form>

			{/* ─── PRIMARY DOMAIN RAIL (Typographic Text Links - No Pill Tags) ─── */}
			<div className="flex flex-col gap-3">


				<div className="flex items-center gap-x-6 gap-y-2 text-sm font-sans overflow-x-auto pb-1.5 sm:flex-wrap scrollbar-none">
					<button
						type="button"
						onClick={() => handleDomainSelect("all")}
						className={`py-1 transition-colors relative font-medium shrink-0 ${
							currentDomain === "all"
								? "text-primary font-bold border-b-2 border-brand-gold pb-0.5"
								: "text-on-surface-variant hover:text-primary"
						}`}
					>
						All
					</button>

					{PRIMARY_DOMAINS.map((dom) => {
						const isActive = currentDomain === dom.slug;
						return (
							<button
								key={dom.id}
								type="button"
								onClick={() => handleDomainSelect(dom.slug)}
								className={`py-1 transition-colors relative font-medium shrink-0 ${
									isActive
										? "text-primary font-bold border-b-2 border-brand-gold pb-0.5"
										: "text-on-surface-variant hover:text-primary"
								}`}
							>
								{dom.title}
							</button>
						);
					})}
				</div>
			</div>

			{/* ─── PROGRESSIVE DISCLOSURE: CONTEXTUAL SUB-CATEGORY RAIL ─── */}
			{activeDomainObj && activeDomainObj.subCategories.length > 0 && (
				<div className="p-3.5 sm:p-4 rounded-xl bg-surface-container-low border border-surface-container-high/80 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in">


					<div className="flex items-center gap-x-5 gap-y-1.5 text-xs font-sans overflow-x-auto pb-1 sm:flex-wrap scrollbar-none">
						{activeDomainObj.subCategories.map((sub) => {
							const isSubActive =
								currentSubCategory === sub.slug ||
								(currentSubCategory === "all" && sub.slug === "all");
							return (
								<button
									key={sub.id}
									type="button"
									onClick={() => handleSubCategorySelect(sub.slug)}
									className={`transition-colors py-0.5 ${
										isSubActive
											? "text-primary font-bold underline decoration-brand-gold decoration-2 underline-offset-4"
											: "text-on-surface-variant hover:text-primary"
									}`}
								>
									{sub.title}
								</button>
							);
						})}
					</div>
				</div>
			)}

			{/* ─── COURSEWORK INCLUSION TOGGLE & SCHOLARLY CONTEXT ─── */}
			<div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs font-sans">
				<button
					type="button"
					onClick={handleToggleCoursework}
					className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border transition-all ${
						isCourseworkIncluded
							? "bg-primary text-brand-warm-white border-primary shadow-sm"
							: "bg-surface-container-low text-on-surface-variant border-surface-container-high hover:border-brand-gold/60 hover:text-primary"
					}`}
				>
					<span
						className={`w-2 h-2 rounded-full ${
							isCourseworkIncluded ? "bg-brand-gold" : "bg-outline/50"
						}`}
					/>
					<span className="font-semibold">
						{isCourseworkIncluded
							? "324-Session Translation Course Included"
							: "Include 324-Session Translation Course"}
					</span>
				</button>

				{currentDomain === "tafsir" && !isCourseworkIncluded && (
					<Link
						href="/lectures/tarjuma-e-quran"
						className="text-secondary hover:underline font-bold inline-flex items-center gap-1"
					>
						<span>Coursework Syllabus →</span>
					</Link>
				)}
			</div>

			{/* Contextual Notice when browsing Tafsir without coursework */}
			{currentDomain === "tafsir" && !isCourseworkIncluded && (
				<div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<span className="font-sans text-[11px] uppercase tracking-wider font-bold text-secondary block">
							Showing 27 Thematic Exegesis Discourses
						</span>
						<p className="font-sans text-xs text-on-surface-variant mt-0.5">
							The 324-session verse-by-verse Translation Course is separated to keep these thematic talks accessible.
						</p>
					</div>

					<div className="flex items-center gap-3 shrink-0">
						<button
							type="button"
							onClick={handleToggleCoursework}
							className="text-xs font-sans font-bold text-primary hover:text-secondary underline"
						>
							Include all 324 sessions in grid
						</button>
						<Link
							href="/lectures/tarjuma-e-quran"
							className="px-3.5 py-1.5 rounded-lg bg-primary text-brand-warm-white text-xs font-sans font-bold hover:bg-primary-container transition-colors"
						>
							View Complete Syllabus →
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
