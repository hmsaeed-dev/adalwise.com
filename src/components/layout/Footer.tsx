import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { footerNav } from "@/config/nav";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low px-gutter-mobile md:px-gutter-desktop pt-space-2xl pb-space-3xl mt-space-2xl text-on-surface border-t border-surface-container-high/40">
      <div className="max-w-container-max mx-auto flex flex-col gap-space-xl">
        {/* Brand Bar */}
        <div className="flex items-center justify-between pb-space-md border-b border-surface-container-highest">
          <div className="flex items-center gap-space-xs">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-tertiary-fixed">
              <span className="material-symbols-outlined text-[16px]">balance</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary font-bold tracking-wider uppercase leading-none">
                {siteConfig.name}
              </span>
              <span className="font-urdu text-[11px] text-tertiary font-bold -mt-0.5">
                {siteConfig.urduName}
              </span>
            </div>
          </div>
          <span className="font-label-sm text-label-sm text-tertiary font-bold uppercase tracking-widest text-[10px]">
            Classical Jurisprudence
          </span>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
              Navigation
            </span>
            <div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              {footerNav.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
              Academy
            </span>
            <div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              {footerNav.academy.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-space-xs col-span-2 md:col-span-2">
            <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
              Mandate
            </span>
            <p className="font-body-sm text-on-surface-variant leading-relaxed">
              Adalwise re-anchors contemporary constitutional and moral inquiry inside
              classical Islamic jurisprudential methodologies—interrogating textual jurisprudence
              with academic rigor.
            </p>
          </div>
        </div>

        {/* Copyright & Meta */}
        <div className="pt-space-md border-t border-surface-container-highest flex flex-col sm:flex-row items-center justify-between gap-space-xs text-center sm:text-left">
          <p className="font-label-sm text-label-sm text-on-surface-variant text-[11px] tracking-wide">
            © {new Date().getFullYear()} Adalwise Institute. All rights reserved.
          </p>
          <span className="font-urdu text-[12px] text-tertiary">
            عدل و حکمت — ادارہ برائے تحقیقِ فقہ و قانون
          </span>
        </div>
      </div>
    </footer>
  );
}
