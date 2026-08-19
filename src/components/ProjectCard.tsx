"use client";

import { forwardRef } from "react";
import type { Project } from "@/data/projects";
import { LivePreview } from "./LivePreview";

type ProjectCardProps = {
  project: Project;
  active: boolean;
  live: boolean;
  dataIndex: number;
};

export const ProjectCard = forwardRef<HTMLAnchorElement, ProjectCardProps>(
  function ProjectCard({ project, active, live, dataIndex }, ref) {
    return (
      <a
        ref={ref}
        data-index={dataIndex}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hub-card flex w-full shrink-0 flex-col gap-3 rounded-xl bg-surface p-3 md:w-[78vw] md:max-w-[640px] md:snap-center lg:w-[66vw] lg:max-w-[760px]"
      >
        <div className="aspect-[16/10] w-full overflow-hidden rounded-lg bg-ink">
          <LivePreview project={project} active={active} live={live} />
        </div>
        <div className="flex flex-col gap-2 px-1 pb-1">
          <h3 className="text-[1.625rem] font-bold leading-[1.2] tracking-[-0.02em] text-cream">
            {project.name}
          </h3>
          <p className="text-[0.9375rem] leading-[1.6] text-muted">{project.tagline}</p>
        </div>
      </a>
    );
  },
);
