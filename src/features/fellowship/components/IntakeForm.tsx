"use client";

import React, { useState } from "react";
import { CheckCircle, Check, Loader2, Send } from "lucide-react";
import { submitFellowshipAction } from "@/app/actions/submit-fellowship";

export function IntakeForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Lahore",
    background: "Graduate / Researcher",
    interests: ["Constitutional Law"],
    statement: "",
  });

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      }
      return { ...prev, interests: [...prev.interests, interest] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg("");

    const res = await submitFellowshipAction(formData);
    setIsPending(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(res.error || "Submission failed. Please check your fields.");
    }
  };

  const availableInterests = [
    "Constitutional Law & Statecraft",
    "Classical Usul al-Fiqh",
    "Contractual Equity & Economics",
    "Quranic Exegesis (Tafsir)",
    "Seerat & Prophetic Governance",
  ];

  if (submitted) {
    return (
      <div className="w-full max-w-xl mx-auto p-space-xl bg-surface-container-lowest rounded-[28px] shadow-lg border border-surface-container-high text-center flex flex-col items-center gap-space-md animate-in fade-in zoom-in-95 duration-200 my-space-xl">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-tertiary-fixed shadow-md">
          <CheckCircle className="w-8 h-8 text-tertiary-fixed" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-headline-lg text-primary font-bold font-serif">
            Application Status
          </h2>
        </div>
        <p className="font-body-md text-on-surface-variant leading-relaxed max-w-md">
          Thank you, <strong className="text-primary">{formData.fullName}</strong>. Your application has been submitted.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-space-sm px-space-md py-space-xs bg-primary text-on-primary font-label-md uppercase tracking-wider rounded-full hover:bg-primary-container transition-colors font-semibold"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-space-lg sm:p-space-xl bg-surface-container-lowest rounded-[28px] shadow-md border border-surface-container-high my-space-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
        {/* Personal Details */}
        <div className="flex flex-col gap-space-xs border-b border-surface-container-high pb-space-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-space-2xs">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm uppercase tracking-wider text-[10px] text-on-surface-variant font-semibold">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Muhammad Tariq"
                className="p-space-xs rounded-xl bg-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-body-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm uppercase tracking-wider text-[10px] text-on-surface-variant font-semibold">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tariq@gmail.com"
                className="p-space-xs rounded-xl bg-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-body-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm uppercase tracking-wider text-[10px] text-on-surface-variant font-semibold">
                WhatsApp
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="p-space-xs rounded-xl bg-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-body-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm uppercase tracking-wider text-[10px] text-on-surface-variant font-semibold">
                City
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Lahore / Islamabad / Abroad"
                className="p-space-xs rounded-xl bg-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-body-sm"
              />
            </div>
          </div>
        </div>

        {/* Academic Profile */}
        <div className="flex flex-col gap-space-xs border-b border-surface-container-high pb-space-md">

          <div className="flex flex-col gap-1 mt-space-2xs">
            <label className="font-label-sm uppercase tracking-wider text-[10px] text-on-surface-variant font-semibold">
              Primary Academic Track
            </label>
            <select
              value={formData.background}
              onChange={(e) => setFormData({ ...formData, background: e.target.value })}
              className="p-space-xs rounded-xl bg-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-body-sm"
            >
              <option value="Seminary (Dars-e-Nizami / Alimiyyah)">
                Traditional Seminary
              </option>
              <option value="Law Degree (LLB / LLM)">Scholar</option>
              <option value="University Scholar / Faculty">University Faculty</option>
              <option value="General Professional / Independent Student">
                Professional / Independent Student
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-1 mt-space-xs">
            <label className="font-label-sm uppercase tracking-wider text-[10px] text-on-surface-variant font-semibold">
              Your Focus
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
              {availableInterests.map((interest) => {
                const isSelected = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`p-2 text-left rounded-xl text-[12px] font-semibold transition-all border flex items-center justify-between ${
                      isSelected
                        ? "bg-primary-container text-surface border-primary"
                        : "bg-surface text-on-surface border-surface-container-high hover:bg-surface-container"
                    }`}
                  >
                    <span>{interest}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-tertiary-fixed shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Statement of Intent */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex flex-col gap-1 mt-space-2xs">
            <label className="font-label-sm uppercase tracking-wider text-[10px] text-on-surface-variant font-semibold">
              Why do you wish to join?
            </label>
            <textarea
              required
              rows={4}
              value={formData.statement}
              onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
              placeholder="Briefly state your intellectual inquiries and what you hope to contribute to our deliberations..."
              className="p-space-xs rounded-xl bg-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-body-sm resize-none"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-space-xs rounded-xl bg-error-container text-on-error-container text-body-sm font-medium">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-space-sm w-full py-space-sm bg-primary text-on-primary font-label-md uppercase tracking-wider rounded-full hover:bg-primary-container transition-colors font-bold shadow-md select-none flex items-center justify-center gap-space-xs disabled:opacity-70"
        >
          <span>{isPending ? "Submitting Application..." : "Submit"}</span>
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
