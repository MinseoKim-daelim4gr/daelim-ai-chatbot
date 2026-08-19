import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "대림대학교 AI 챗봇",
  description: "장학 · 등록 · 수강신청 · 성적 · 교내 연락처 안내 챗봇",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
