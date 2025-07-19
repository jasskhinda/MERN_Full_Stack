import "./globals.css";
import { ReactNode } from "react";
import NextAuthSessionProvider from "@/components/SessionProvider";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "MERN Stack | Modern Full-Stack Application",
  description: "A production-grade web application built with Next.js, MongoDB, and modern authentication",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <NextAuthSessionProvider>
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1 relative">
              {children}
            </main>
          </div>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}