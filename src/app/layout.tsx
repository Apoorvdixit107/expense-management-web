import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SubscriptionProvider } from "@/components/SubscriptionProvider";
import { ToastProvider } from "@/components/toast";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ExpenseKit | Expense Management",
  description: "Track expenses, view reports, and manage your spending. Sign in to get started.",
  icons: {
    icon: [{ url: "/icon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/favicon.png", sizes: "192x192", type: "image/png" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-paper font-sans text-ink">
        <ThemeProvider>
          <ToastProvider>
            <SubscriptionProvider>
              {children}
              <WhatsAppButton />
            </SubscriptionProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
