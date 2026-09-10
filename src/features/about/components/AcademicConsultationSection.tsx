"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { submitInquiryAction } from "@/app/actions/submit-inquiry";

export function AcademicConsultationSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    affiliation: "",
    query: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg("");

    const res = await submitInquiryAction(formData);
    setIsPending(false);

    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsModalOpen(false);
        setFormData({ name: "", email: "", affiliation: "", query: "" });
      }, 2500);
    } else {
      setErrorMsg(res.error || "Failed to dispatch inquiry. Please check fields.");
    }
  };

  return (
    <>
      <section className="px-gutter-mobile md:px-gutter-desktop mt-space-2xl mb-space-xl max-w-container-max mx-auto w-full">
        <div className="bg-primary text-on-primary p-space-lg sm:p-space-xl rounded-[26px] relative overflow-hidden shadow-lg border border-primary-container">
          <div className="flex flex-col gap-space-xs relative z-10 max-w-xl">
            <span className="font-label-sm uppercase tracking-widest text-tertiary-fixed font-bold text-[11px]">
              Direct Engagement
            </span>
            <h2 className="font-headline-md text-[24px] sm:text-headline-md text-on-primary font-bold font-serif leading-tight">
              Academic Consultation &amp; Juridical Queries
            </h2>
            <p className="font-body-sm text-on-primary-container leading-relaxed">
              Submit formal jurisprudential inquiries, research collaborations, or discourse proposals directly to Dr. Hafiz Haseeb and the faculty council.
            </p>

            <div className="mt-space-md flex flex-col sm:flex-row gap-space-xs">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto min-h-[44px] bg-tertiary-container hover:bg-tertiary text-on-tertiary-container px-space-md py-space-xs flex items-center justify-center gap-space-xs transition-colors shadow-sm font-label-md uppercase tracking-wider font-semibold rounded-full select-none"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Submit Inquiry</span>
              </button>

              <a
                href={`mailto:${siteConfig.author.email}`}
                className="w-full sm:w-auto min-h-[44px] bg-primary-container/80 hover:bg-surface-tint text-surface px-space-md py-space-xs flex items-center justify-center gap-space-xs transition-colors font-label-md uppercase tracking-wider rounded-full border border-primary-container"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
                <span>{siteConfig.author.email}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-gutter-mobile">
          <div className="bg-surface-container-low max-w-md w-full p-space-lg rounded-[24px] shadow-2xl border border-surface-container-high relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-tertiary-container text-[20px]">
                  edit_note
                </span>
                <span className="font-headline-sm text-[16px] text-primary font-bold font-serif">
                  Formal Inquiry Dispatch
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {submitted ? (
              <div className="py-space-xl text-center flex flex-col items-center gap-space-xs">
                <span className="material-symbols-outlined text-[48px] text-tertiary-container">
                  check_circle
                </span>
                <h4 className="font-headline-sm text-primary font-bold font-serif">
                  Inquiry Dispatched
                </h4>
                <p className="font-body-sm text-on-surface-variant">
                  Your question has been logged with the faculty chamber. Dr. Haseeb will review it in accordance with discourse priorities.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm mt-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm uppercase tracking-wider text-[11px] text-on-surface-variant font-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Salman Qazi"
                    className="p-space-xs rounded-xl bg-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-body-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm uppercase tracking-wider text-[11px] text-on-surface-variant font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="salman@institution.edu"
                    className="p-space-xs rounded-xl bg-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-body-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm uppercase tracking-wider text-[11px] text-on-surface-variant font-semibold">
                    Academic / Institutional Affiliation
                  </label>
                  <input
                    type="text"
                    value={formData.affiliation}
                    onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                    placeholder="e.g. Faculty of Law, University of the Punjab"
                    className="p-space-xs rounded-xl bg-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-body-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm uppercase tracking-wider text-[11px] text-on-surface-variant font-semibold">
                    Juridical Query or Proposal
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.query}
                    onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                    placeholder="Articulate the textual question or deliberation topic..."
                    className="p-space-xs rounded-xl bg-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-body-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-space-xs w-full py-space-xs bg-primary hover:bg-primary-container text-on-primary font-label-md uppercase tracking-wider font-semibold rounded-full transition-colors shadow-sm"
                >
                  Send Inquiry to Council
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
