import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "프로젝트 허브",
  description:
    "지금 실제로 돌아가고 있는 프로젝트 화면을 모아 보여주는 개인 포트폴리오 허브",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="h-full min-h-full bg-ink font-sans text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
