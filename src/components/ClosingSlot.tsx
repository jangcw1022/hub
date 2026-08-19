import Link from "next/link";

export function ClosingSlot() {
  return (
    <div className="flex w-full shrink-0 flex-col items-center justify-center gap-6 px-6 py-24 md:w-[40vw] md:max-w-[420px] md:snap-center md:py-0">
      <p className="text-[0.9375rem] leading-[1.6] text-muted">마지막 프로젝트입니다</p>
      <Link
        href="/"
        className="hub-card rounded-lg px-6 py-3 text-[0.9375rem] font-bold text-cream"
      >
        돌아가기
      </Link>
    </div>
  );
}
