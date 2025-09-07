import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {AuthProvider} from "@/context/AuthContext";
import {BirthdayProvider} from "@/context/BirthdayContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Birthday Reminder - Never Miss a Birthday Again",
  description: "Keep track of all your friends and family's birthdays with smart reminders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-900`}
      >
      <AuthProvider>
        <BirthdayProvider>
          {children}
        </BirthdayProvider>
      </AuthProvider>
      </body>
    </html>
  );
}
