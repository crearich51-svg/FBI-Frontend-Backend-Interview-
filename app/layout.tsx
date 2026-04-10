import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "@/shared/layout/Navbar";
import { Providers } from "@/shared/providers/Providers";
import type { AppLayoutProps } from "@/shared/types";
import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "前端面试通关平台",
  description: "帮助前端工程师高效刷题与复盘的面试通关平台。",
};

export default function RootLayout({ children }: AppLayoutProps) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <Providers>
          <Navbar />
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
