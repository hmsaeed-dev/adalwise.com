import React from "react";
import { MajlisDoc } from "@/lib/content/schemas";
import { MajlisUpcoming } from "./MajlisUpcoming";
import { MajlisArchive } from "./MajlisArchive";

interface MajlisChronoProps {
  sessions: MajlisDoc[];
}

export function MajlisChrono({ sessions }: MajlisChronoProps) {
  if (!sessions || sessions.length === 0) {
    return null;
  }

  const upcomingSession =
    sessions.find((s) => s.session.status === "upcoming") || sessions[0];
  const archiveSessions = sessions.filter(
    (s) => s.slug !== upcomingSession?.slug
  );

  return (
    <div className="w-full text-brand-charcoal py-20 px-6 md:px-12 lg:px-16 selection:bg-brand-primary selection:text-brand-warm-white">
      <div className="max-w-6xl mx-auto">
        {upcomingSession && <MajlisUpcoming doc={upcomingSession} />}
        <MajlisArchive sessions={archiveSessions} />
      </div>
    </div>
  );
}
