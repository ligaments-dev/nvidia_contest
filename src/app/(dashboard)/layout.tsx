"use client";

import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextUIProvider>
      <Header />
      <main>{children}</main>
      {/* <Footer /> */}
    </NextUIProvider>
  );
}
