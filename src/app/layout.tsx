"use client";
import localFont from "next/font/local";
import "./globals.css";

import { Layout, ConfigProvider, theme } from "antd";
import { Sidebar } from "../components/Sidebar";

const { Content } = Layout;

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfigProvider
          theme={{
            algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
          }}
        >
          <Layout className="min-h-screen">
            <Sidebar />
            <Layout>
              <Content>{children}</Content>
            </Layout>
          </Layout>
        </ConfigProvider>
      </body>
    </html>
  );
}
