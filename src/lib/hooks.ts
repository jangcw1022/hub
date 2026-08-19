"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

function subscribeToMediaQuery(query: string, onChange: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export function useMinWidth(px: number) {
  const query = `(min-width: ${px}px)`;
  return useSyncExternalStore(
    (onChange) => subscribeToMediaQuery(query, onChange),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  return useSyncExternalStore(
    (onChange) => subscribeToMediaQuery(query, onChange),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

// 콜백 ref를 state로 들고 있어야 한다 — 이 훅이 반환하는 ref는
// LivePreview에서 조건부로 마운트되는 요소(첫 렌더에는 안 붙어 있다가
// `live`가 true로 바뀐 뒤에야 붙는다)에 걸리므로, 일반 useRef + `[ref]`
// 의존성 effect로는 요소가 나중에 붙어도 재실행되지 않아 폭이 0으로 고정된다.
export function useElementWidth<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [width, setWidth] = useState(0);
  const ref = useCallback((el: T | null) => setNode(el), []);

  useEffect(() => {
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return [width, ref] as const;
}
