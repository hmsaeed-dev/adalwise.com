"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { mainNavItems } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { LiveSearchModal } from "@/components/search/LiveSearchModal";

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Global Ctrl+K / Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high/40">
        <div className="h-16 px-gutter-mobile md:px-gutter-desktop max-w-container-max mx-auto flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <Link href="/" className="flex items-center gap-space-xs group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary shadow-sm ring-1 ring-tertiary-container/40 p-0.5 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <Image
                src="/images/logo-badge.png"
                alt={`${siteConfig.name} Emblem`}
                width={36}
                height={36}
                className="w-full h-full object-contain rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-[17px] tracking-widest uppercase text-primary font-bold leading-none">
                {siteConfig.name}
              </span>
              <span className="font-urdu text-[11px] text-tertiary font-bold -mt-0.5 leading-none">
                {siteConfig.urduName}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-space-md text-body-sm font-medium">
            {mainNavItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-space-xs py-1 transition-colors hover:text-primary relative font-sans",
                    isActive
                      ? "text-primary font-bold"
                      : "text-on-surface-variant"
                  )}
                >
                  {item.title}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-space-xs">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Archive (Ctrl+K)"
              className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-container rounded-full transition-colors"
            >
              <Search className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Pinned Join CTA */}
            <Link
              href="/join"
              className="min-h-[40px] px-space-md py-space-2xs bg-primary-container text-surface font-label-sm uppercase tracking-wider flex items-center justify-center transition-colors hover:bg-primary rounded-full shadow-sm"
            >
              Join
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              aria-label="Open Navigation Menu"
              onClick={() => setIsDrawerOpen(true)}
              className="w-10 h-10 text-primary flex lg:hidden items-center justify-center hover:bg-surface-container rounded-full transition-colors"
            >
              <Menu className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-4/5 max-w-xs bg-surface h-full p-space-lg flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
                <div className="flex items-center gap-space-xs">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary ring-1 ring-tertiary-container/30 p-0.5 shrink-0">
                    <Image
                      src="/images/logo-badge.png"
                      alt={`${siteConfig.name} Emblem`}
                      width={32}
                      height={32}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[16px] tracking-wider uppercase text-primary font-bold leading-none">
                      {siteConfig.name}
                    </span>
                    <span className="font-urdu text-[11px] text-tertiary font-bold -mt-0.5">
                      {siteConfig.urduName}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close Menu"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary rounded-full transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              <div className="p-space-xs bg-surface-container-low rounded-xl">
                <span className="font-urdu text-[12px] text-primary block dir-rtl text-right font-bold">
                  عدل و حکمت — ادارہ برائے تفہیمِ دین
                </span>
                <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant block mt-0.5">
                  Academic Portals
                </span>
              </div>

              <nav className="flex flex-col gap-space-2xs text-body-md font-medium">
                {mainNavItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "py-space-xs px-space-sm rounded-xl flex items-center justify-between transition-colors",
                        isActive
                          ? "bg-surface-container-high text-primary font-semibold"
                          : "text-on-surface hover:bg-surface-container"
                      )}
                    >
                      <div className="flex items-center gap-space-xs">
                        {item.icon && (
                          <span className="material-symbols-outlined text-[18px] text-tertiary-container">
                            {item.icon}
                          </span>
                        )}
                        <span>{item.title}</span>
                      </div>
                      {item.urduTitle && (
                        <span className="font-urdu text-[11px] text-on-surface-variant">
                          {item.urduTitle}
                        </span>
                      )}
                    </Link>
                  );
                })}
                <Link
                  href="/search"
                  className="py-space-xs px-space-sm rounded-xl flex items-center justify-between text-on-surface hover:bg-surface-container transition-colors"
                >
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[18px] text-tertiary-container">
                      search
                    </span>
                    <span>Search Archive</span>
                  </div>
                </Link>
              </nav>
            </div>

            <div className="pt-space-md border-t border-surface-container-high flex flex-col gap-space-xs">
              <Link
                href="/join"
                className="w-full py-space-sm bg-primary text-on-primary font-label-md text-center uppercase tracking-wider block rounded-full hover:bg-primary-container transition-colors shadow-sm"
              >
                Join Fellowship
              </Link>
              <span className="text-[11px] text-center text-on-surface-variant font-label-sm uppercase tracking-wider">
                Classical Jurisprudence
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Live Search Modal Dialog */}
      <LiveSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
