"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { PRIMARY_DOMAINS } from "@/lib/taxonomy/registry";

export function LecturesSearchFilter() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const currentDomain = searchParams.get("domain") || "all";
	const currentQueryParam = searchParams.get("q") || "";
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
		// Clean out legacy/unneeded params
		params.delete("subCategory");
		params.delete("coursework");
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
		} else {
			params.set("domain", domainSlug);
		}
		params.delete("subCategory");
		params.delete("coursework");
		params.set("page", "1");
		startTransition(() => {
			router.replace(`/lectures?${params.toString()}`, { scroll: false });
		});
	};

	const clearSearch = () => {
		setSearchTerm("");
		const params = new URLSearchParams(searchParams.toString());
		params.delete("q");
		params.delete("subCategory");
		params.delete("coursework");
		params.set("page", "1");
		startTransition(() => {
			router.replace(`/lectures?${params.toString()}`, { scroll: false });
		});
	};

	return (
		<div
			id="archive"
			className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop pt-10 pb-6 flex flex-col gap-6 scroll-mt-24"
		>

			{/* Search Input Bar */}
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
						placeholder="Search surahs, topics..."
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

			{/* PRIMARY DOMAIN CATEGORY RAIL ONLY */}
			<div className="flex items-center gap-x-6 gap-y-2 text-sm font-sans overflow-x-auto pb-1.5 sm:flex-wrap scrollbar-none  border-surface-container-high/60">
				<button
					type="button"
					onClick={() => handleDomainSelect("all")}
					className={`py-2 transition-colors relative font-medium shrink-0 ${
						currentDomain === "all"
							? "text-primary font-bold -2 border-brand-gold pb-1.5"
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
							className={`py-2 transition-colors relative font-medium shrink-0 ${
								isActive
									? "text-primary font-bold -2 border-brand-gold pb-1.5"
									: "text-on-surface-variant hover:text-primary"
							}`}
						>
							{dom.title}
						</button>
					);
				})}
			</div>
		</div>
	);
}
