"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/data/projects";
import { useElementWidth } from "@/lib/hooks";

const TIMEOUT_MS = 5000;
const IFRAME_W = 1280;
const IFRAME_H = 800;

export function LivePreview({
  project,
  active,
  live,
}: {
  project: Project;
  /** 화면(+인접 1칸)에 들어와 마운트되어야 하는지 */
  active: boolean;
  /** 데스크톱/태블릿에서만 true — 모바일은 항상 정적 스크린샷 */
  live: boolean;
}) {
  const [width, containerRef] = useElementWidth<HTMLDivElement>();
  const scale = width > 0 ? width / IFRAME_W : 0;
  const hasUrl = Boolean(project.url);

  if (!hasUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface">
        <span className="text-[1.0625rem] font-bold text-cream">{project.name}</span>
      </div>
    );
  }

  if (!live) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.fallbackImage}
        alt={`${project.name} 미리보기`}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-surface">
      {active && scale > 0 ? (
        <LiveFrame key={project.id} project={project} scale={scale} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.fallbackImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "blur(12px) brightness(0.6)" }}
        />
      )}

      {/* 7.3 상호작용 차단 — 클릭·스크롤은 이 오버레이가 받는다 */}
      <div className="absolute inset-0" />
    </div>
  );
}

type LoadState = "loading" | "loaded" | "failed";

function LiveFrame({ project, scale }: { project: Project; scale: number }) {
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    const timer = setTimeout(() => {
      setState((s) => (s === "loaded" ? s : "failed"));
    }, TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0" aria-busy={state === "loading"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.fallbackImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover transition-[filter,opacity] duration-[420ms] ease-out"
        style={{
          filter: state === "loaded" ? "none" : "blur(12px) brightness(0.6)",
          opacity: state === "loaded" ? 0 : 1,
        }}
      />

      {state !== "failed" && (
        <iframe
          src={project.url}
          title={project.name}
          tabIndex={-1}
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setState("loaded")}
          className="absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-[420ms] ease-out"
          style={{
            width: IFRAME_W,
            height: IFRAME_H,
            transform: `scale(${scale})`,
            opacity: state === "loaded" ? 1 : 0,
          }}
        />
      )}

      {state === "loading" && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="scan-line absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber/60 to-transparent" />
        </div>
      )}

      {state === "failed" && (
        <div className="absolute inset-x-0 bottom-0 bg-ink/85 px-4 py-2 text-center text-[0.75rem] text-muted">
          미리보기를 불러오지 못했습니다
        </div>
      )}
    </div>
  );
}
