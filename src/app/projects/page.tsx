import type { Metadata } from "next";
import { ProjectTrack } from "@/components/ProjectTrack";

export const metadata: Metadata = {
  title: "프로젝트 | 프로젝트 허브",
};

export default function ProjectsPage() {
  return (
    <main className="h-dvh w-full md:overflow-hidden">
      <ProjectTrack />
    </main>
  );
}
