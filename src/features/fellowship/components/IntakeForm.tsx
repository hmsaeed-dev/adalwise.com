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
		background: "",
		interests: [] as string[],
	});

	const availableInterests = [
		"Quran & Seerah",
		"Law & Statecraft",
		"Economics",
		"History",
		"Research & Writing",
		"Media and Technology",
	];

	const toggleInterest = (interest: string) => {
		setFormData((prev) => {
			const exists = prev.interests.includes(interest);

			return {
				...prev,
				interests: exists
					? prev.interests.filter((item) => item !== interest)
					: [...prev.interests, interest],
			};
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
			setErrorMsg(
				res.error || "Submission failed. Please check your fields.",
			);
		}
	};

	if (submitted) {
		return (
			<div className="w-full max-w-2xl mx-auto py-space-3xl text-center">
				<div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center shadow-md">
					<CheckCircle className="w-8 h-8 text-tertiary-fixed" />
				</div>

				<p className="mt-space-lg font-label-sm uppercase tracking-[0.2em] text-secondary font-semibold">
					Thank you
				</p>

				<h2 className="mt-space-sm font-display-md text-3xl sm:text-4xl text-primary font-bold">
					Welcome to the conversation.
				</h2>

				<p className="mt-space-md mx-auto max-w-lg font-body-md text-on-surface-variant leading-relaxed">
					Thank you,{" "}
					<strong className="text-primary">
						{formData.fullName}
					</strong>
					. We have received your introduction to the Adlwise Circle
					and appreciate your interest.
				</p>

				<button
					type="button"
					onClick={() => {
						setSubmitted(false);
						setFormData({
							fullName: "",
							email: "",
							phone: "",
							background: "",
							interests: [],
						});
					}}
					className="mt-space-lg inline-flex items-center justify-center px-space-md py-space-xs rounded-full border border-surface-container-high text-primary font-label-sm font-semibold hover:bg-surface-container transition-colors"
				>
					Submit Another Response
				</button>
			</div>
		);
	}

	return (
		<div className="w-full max-w-2xl mx-auto">
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-space-2xl"
			>
				{/* 01 - About You */}
				<section>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
						<Field label="Full Name" required>
							<input
								type="text"
								required
								value={formData.fullName}
								onChange={(e) =>
									setFormData({
										...formData,
										fullName: e.target.value,
									})
								}
								placeholder="Your full name"
								className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-container-high text-on-surface text-sm placeholder:text-on-surface-variant/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
							/>
						</Field>

						<Field label="Email Address" required>
							<input
								type="email"
								required
								value={formData.email}
								onChange={(e) =>
									setFormData({
										...formData,
										email: e.target.value,
									})
								}
								placeholder="you@example.com"
								className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-container-high text-on-surface text-sm placeholder:text-on-surface-variant/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
							/>
						</Field>

						<Field label="WhatsApp" required>
							<input
								type="tel"
								required
								value={formData.phone}
								onChange={(e) =>
									setFormData({
										...formData,
										phone: e.target.value,
									})
								}
								placeholder="+92 300 1234567"
								className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-container-high text-on-surface text-sm placeholder:text-on-surface-variant/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
							/>
						</Field>
					</div>
				</section>

				{/* 02 - Background */}
				<section>
					<p className="mt-2 text-xs pb-4 text-on-surface-variant">
						Your background.
					</p>
					<div className="flex flex-wrap gap-2">
						{[
							"Student",
							"Researcher / Academic",
							"Professional",
							"Independent Learner",
						].map((option) => {
							const selected = formData.background === option;

							return (
								<button
									key={option}
									type="button"
									onClick={() =>
										setFormData({
											...formData,
											background: option,
										})
									}
									className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
										selected
											? "bg-primary text-on-primary border-primary"
											: "bg-surface text-on-surface border-surface-container-high hover:bg-surface-container"
									}`}
								>
									{option}
								</button>
							);
						})}
					</div>
				</section>

				{/* 03 - Interests */}
				<section>
					<p className="mt-2 text-xs pb-4 text-on-surface-variant">
						Select all that interest you.
					</p>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						{availableInterests.map((interest) => {
							const selected =
								formData.interests.includes(interest);

							return (
								<button
									key={interest}
									type="button"
									onClick={() => toggleInterest(interest)}
									className={`min-h-12 px-3 py-2.5 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between gap-2 ${
										selected
											? "bg-primary text-on-primary border-primary"
											: "bg-surface text-on-surface border-surface-container-high hover:bg-surface-container"
									}`}
								>
									<span>{interest}</span>

									{selected && (
										<Check className="w-4 h-4 shrink-0" />
									)}
								</button>
							);
						})}
					</div>
				</section>

				{errorMsg && (
					<div className="p-4 rounded-xl bg-error-container text-on-error-container text-sm font-medium">
						{errorMsg}
					</div>
				)}

				{/* Submit */}
				<div className="pt-space-sm">
					<button
						type="submit"
						disabled={
							isPending ||
							!formData.background ||
							formData.interests.length === 0
						}
						className="w-full py-3.5 px-space-md bg-primary text-on-primary rounded-full font-label-md uppercase tracking-wider font-bold shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
					>
						<span>
							{isPending ? "Submitting..." : "Join the Circle"}
						</span>

						{isPending ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Send className="w-4 h-4" />
						)}
					</button>
				</div>
			</form>
		</div>
	);
}

function Field({
	label,
	required,
	children,
}: {
	label: string;
	required?: boolean;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<label className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
				{label}
				{required && <span className="text-secondary ml-1">*</span>}
			</label>

			{children}
		</div>
	);
}
