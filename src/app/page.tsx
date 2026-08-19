"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") router.push("/projects");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <main className="relative flex h-dvh w-full flex-col items-center justify-center gap-8 px-6 text-center">
      <h1
        className="fade-up text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-cream"
        style={{ animationDelay: "0ms" }}
      >
        프로젝트 허브
      </h1>

      <p
        className="fade-up max-w-[36rem] text-[1.0625rem] leading-[1.75] text-muted"
        style={{ animationDelay: "80ms" }}
      >
        제가 만든 프로젝트들을 모은 곳입니다.
        <br />
        스크린샷이 아니라 지금 실제로 돌아가는 화면을 담았습니다.
        <br />
        원하는 프로젝트를 눌러 들어갈 수 있습니다.
      </p>

      <Link
        href="/projects"
        className="fade-up rounded-lg bg-amber px-8 py-3 text-[0.9375rem] font-bold text-ink transition-opacity duration-[150ms] hover:opacity-90 focus-visible:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
        style={{ animationDelay: "160ms" }}
      >
        들어가기
      </Link>

      <p
        className="fade-up absolute bottom-10 text-[0.75rem] font-medium tracking-[0.14em] text-muted"
        style={{ animationDelay: "240ms" }}
      >
        {projects.length} projects
      </p>
    </main>
  );
}
