/*
 * @Author: songjingyang songjingyang@meishubao.com
 * @Date: 2025-07-23 17:05:58
 * @LastEditors: songjingyang songjingyang@meishubao.com
 * @LastEditTime: 2025-07-23 17:39:49
 * @FilePath: /T-calculator/src/app/layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A股做T成本计算器 - 专业的股票日内交易计算工具",
  description:
    "专业的A股做T（日内交易）成本计算器，支持多家券商费率，精确计算交易成本、盈亏和收益率，帮助投资者做出明智决策。",
  keywords: "A股,做T,日内交易,股票计算器,交易成本,佣金计算,印花税,过户费",
  authors: [{ name: "A股做T计算器" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
