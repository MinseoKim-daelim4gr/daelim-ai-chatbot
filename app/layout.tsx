import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "디포레스트(DForest) 챗봇",
  description: "대림대 관련 안내 챗봇",
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
