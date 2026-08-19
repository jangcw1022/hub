"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ClosingSlot } from "./ClosingSlot";
import { useMinWidth, usePrefersReducedMotion } from "@/lib/hooks";

function closestCardIndex(root: HTMLElement, cards: (HTMLAnchorElement | null)[]) {
  const rootRect = root.getBoundingClientRect();
  const center = rootRect.left + rootRect.width / 2;
  let closest = 0;
  let closestDist = Infinity;
  cards.forEach((el, i) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dist = Math.abs(rect.left + rect.width / 2 - center);
    if (dist < closestDist) {
      closestDist = dist;
      closest = i;
    }
  });
  return closest;
}

export function ProjectTrack() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const live = useMinWidth(768);
  const reducedMotion = usePrefersReducedMotion();

  const [activeSet, setActiveSet] = useState<Set<number>>(() => new Set([0]));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);

  // 7.2 인접 카드까지 미리 로드, 벗어나면 언마운트
  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setActiveSet((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (entry.isIntersecting) next.add(idx);
            else next.delete(idx);
          }
          return next;
        });
      },
      { root, rootMargin: "0px 100% 0px 100%", threshold: 0 },
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // 현재 위치(인디케이터용) 추적
  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;

    let raf = 0;
    const measure = () => setCurrentIndex(closestCardIndex(root, cardRefs.current));
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    measure();
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(projects.length - 1, index));
      cardRefs.current[clamped]?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [reducedMotion],
  );

  // 마우스 휠(세로) -> 가로 이동
  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;

    const onWheel = (e: WheelEvent) => {
      if (root.scrollWidth <= root.clientWidth) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      root.scrollLeft += e.deltaY;
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, []);

  // 방향키
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const root = trackRef.current;
      if (!root || root.scrollWidth <= root.clientWidth) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollToIndex(currentIndex + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToIndex(currentIndex - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentIndex, scrollToIndex]);

  // 마우스 드래그로 이동 (터치는 네이티브 스와이프 사용)
  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;

    let dragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (root.scrollWidth <= root.clientWidth) return;
      dragging = true;
      startX = e.clientX;
      startScrollLeft = root.scrollLeft;
      root.setPointerCapture(e.pointerId);
      root.style.scrollSnapType = "none";
      root.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      root.scrollLeft = startScrollLeft - (e.clientX - startX);
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      root.style.scrollSnapType = "";
      root.style.cursor = "";
      scrollToIndex(closestCardIndex(root, cardRefs.current));
    };

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", endDrag);
    root.addEventListener("pointercancel", endDrag);
    return () => {
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", endDrag);
      root.removeEventListener("pointercancel", endDrag);
    };
  }, [scrollToIndex]);

  // 최초 진입 힌트 — 0.75s 후 노출, 상호작용 또는 5s 후 소멸
  useEffect(() => {
    if (reducedMotion) return;
    const root = trackRef.current;
    if (!root) return;

    const showTimer = setTimeout(() => setHintVisible(true), 750);
    const hideTimer = setTimeout(() => setHintVisible(false), 5000);

    const dismiss = () => {
      setHintVisible(false);
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };

    root.addEventListener("wheel", dismiss, { once: true });
    root.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      root.removeEventListener("wheel", dismiss);
      root.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, [reducedMotion]);

  return (
    <div className="relative flex h-full w-full flex-col">
      <div
        ref={trackRef}
        className="flex flex-1 flex-col gap-16 overflow-y-auto px-6 py-16 md:h-dvh md:flex-row md:items-center md:gap-8 md:overflow-x-auto md:overflow-y-hidden md:px-[30vw] md:py-0 md:[scroll-behavior:smooth] md:[scroll-snap-type:x_mandatory]"
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            project={project}
            active={activeSet.has(i)}
            live={live}
            dataIndex={i}
          />
        ))}
        <ClosingSlot />
      </div>

      <button
        type="button"
        aria-label="이전 프로젝트"
        onClick={() => scrollToIndex(currentIndex - 1)}
        disabled={currentIndex <= 0}
        className="hub-card absolute left-8 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 disabled:pointer-events-none disabled:opacity-30 md:flex"
      >
        <span className="chevron chevron-left" />
      </button>

      <button
        type="button"
        aria-label="다음 프로젝트"
        onClick={() => scrollToIndex(currentIndex + 1)}
        disabled={currentIndex >= projects.length - 1}
        className="hub-card absolute right-8 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 disabled:pointer-events-none disabled:opacity-30 md:flex"
      >
        <span className="chevron chevron-right" />
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-center gap-3 md:flex">
        {projects.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}번째 프로젝트로 이동`}
            aria-current={i === currentIndex}
            onClick={() => scrollToIndex(i)}
            className="pointer-events-auto h-2 w-2 rounded-full transition-colors duration-[260ms]"
            style={{
              backgroundColor: i === currentIndex ? "var(--amber)" : "var(--amber-dim)",
            }}
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-8 hidden justify-center transition-opacity duration-[260ms] md:flex"
        style={{ opacity: hintVisible ? 1 : 0 }}
      >
        <span className="rounded-lg border border-line bg-ink/70 px-4 py-2 text-[0.75rem] tracking-[0.02em] text-muted">
          옆으로 스크롤하세요
        </span>
      </div>
    </div>
  );
}
