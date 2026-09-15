"use client";

import React, { useState } from "react";
import { CourseCurriculumRibbon } from "./CourseCurriculumRibbon";
import { StudyNotesDrawer } from "./StudyNotesDrawer";

export function LecturesViewContainer() {
	const [isNotesOpen, setIsNotesOpen] = useState(false);

	return (
		<>
			<CourseCurriculumRibbon onOpenNotes={() => setIsNotesOpen(true)} />
			<StudyNotesDrawer
				isOpen={isNotesOpen}
				onClose={() => setIsNotesOpen(false)}
			/>
		</>
	);
}
