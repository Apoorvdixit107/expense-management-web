import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SubscriptionProvider } from "@/components/SubscriptionProvider";
import { UserPreferencesProvider } from "@/components/UserPreferencesProvider";
import { ToastProvider } from "@/components/toast";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieConsent } from "@/components/CookieConsent";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { ReferralCapture } from "@/components/ReferralCapture";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ExpenseKit | Expense Management",
  description: "Track expenses, view reports, and manage your spending. Sign in to get started.",
  applicationName: "ExpenseKit",
  appleWebApp: {
    capable: true,
    title: "ExpenseKit",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/icon-32.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fafafa",
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
              <UserPreferencesProvider>
              <Suspense fallback={null}>
                <ReferralCapture />
              </Suspense>
              {children}
              <WhatsAppButton />
              <ServiceWorkerRegister />
              <InstallPrompt />
              <CookieConsent />
              </UserPreferencesProvider>
            </SubscriptionProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
