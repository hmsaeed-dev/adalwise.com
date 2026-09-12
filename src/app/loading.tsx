import React from "react";
import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="w-full max-w-container-max mx-auto my-auto px-gutter-mobile md:px-gutter-desktop py-space2xl flex flex-col items-center justify-center min-h-[90vh]">

			<div className="flex flex-col items-center gap-space-md animate-pulse">

        <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-container">
					<Loader2 className="w-8 h-8 animate-spin" />
				</div>

        <div className="h-5 w-60 bg-surface-container-highest rounded-full" />
				<div className="h-3 w-45 bg-surface-container-high rounded-full" />
				<div className="h-3 w-45 bg-surface-container-high rounded-full" />
				<div className="h-3 w-45 bg-surface-container-high rounded-full" />

      </div>
		</div>
  );
}
