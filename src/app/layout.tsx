import { LangProvider } from "@/lib/i18n/LangProvider";
import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
  Gowun_Dodum,
  IBM_Plex_Sans_KR,
  Sacramento,
} from "next/font/google";
import { Suspense } from "react";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// Sacramento
const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sacramento",
});

// IBM Plex Sans KR (구글 폰트)
const ibm = IBM_Plex_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-kr",
});

// Cormorant Garamond
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-cormorant",
});

const Gowun = Gowun_Dodum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-gowun",
});

export const metadata: Metadata = {
  title: "진태 ♥ 조은 결혼식에 초대합니다.",
  description: "2026년 02월 28일 토요일 2시 30분",
  icons: { icon: "/streamline-stickies-color_love.ico" },
  openGraph: {
    images: {
      url: "https://jintae-joeun-wedding-invitation.netlify.app/main.jpeg",
      width: 800,
      height: 600,
      alt: "진태 & 조은 결혼식 초대 이미지",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${Gowun.variable} ${geistMono.variable} ${sacramento.variable} ${ibm.variable} ${cormorant.variable} antialiased`}
      >
        <Suspense>
          <LangProvider>{children}</LangProvider>
        </Suspense>
      </body>
    </html>
  );
}
