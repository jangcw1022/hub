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
        className="hub-card flex w-full shrink-0 flex-col gap-2 rounded-xl bg-surface p-3 md:w-[39vw] md:max-w-[320px] md:snap-center lg:w-[33vw] lg:max-w-[380px]"
      >
        <div className="aspect-[16/10] w-full overflow-hidden rounded-lg bg-ink">
          <LivePreview project={project} active={active} live={live} />
        </div>
        <div className="flex flex-col gap-1 px-1 pb-1">
          <h3 className="text-[1.125rem] font-bold leading-[1.3] tracking-[-0.02em] text-cream">
            {project.name}
          </h3>
          <p className="line-clamp-2 text-[0.8125rem] leading-[1.45] text-muted">
            {project.tagline}
          </p>
        </div>
      </a>
    );
  },
);
