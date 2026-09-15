"use client";

import React, { useState } from "react";
import { CourseCurriculumModule } from "./CourseCurriculumModule";
import { StudyNotesDrawer } from "./StudyNotesDrawer";

export function LecturesViewContainer() {
	const [isNotesOpen, setIsNotesOpen] = useState(false);

	return (
		<>
			<CourseCurriculumModule onOpenNotes={() => setIsNotesOpen(true)} />
			<StudyNotesDrawer
				isOpen={isNotesOpen}
				onClose={() => setIsNotesOpen(false)}
			/>
		</>
	);
}
