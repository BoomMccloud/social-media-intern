"use client";
import localFont from "next/font/local";
import "./globals.css";
import { Layout, ConfigProvider, theme } from "antd";
import Providers from "./Providers";
import { StoreInitializer } from "@/components/StoreInitializer";
import { GoogleAnalytics } from "@next/third-parties/google";
import AppHeader from "@/components/Header";

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
      <GoogleAnalytics gaId="G-Y50YDQH1JF" />
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <StoreInitializer />
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#F8BBD0",
              },
              algorithm: [theme.darkAlgorithm],
              components: {
                Layout: {
                  bodyBg: "#0f0f10",
                  headerBg: "#0a0a0a",
                },
                Button: {
                  primaryColor: "#000000",
                  colorBgContainer: "transparent",
                },
                Menu: {
                  darkItemBg: "transparent",
                  darkSubMenuItemBg: "transparent",
                  darkItemSelectedColor: "#000000",
                },
              },
            }}
          >
            <Layout>
              <AppHeader />
              <Layout className="min-h-screen pt-16">
                <Content className="min-h-screen">{children}</Content>
              </Layout>
            </Layout>
          </ConfigProvider>
        </body>
      </Providers>
    </html>
  );
}
