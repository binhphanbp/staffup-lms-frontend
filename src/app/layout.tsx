/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import AIChatWidget from '@/components/ai-chat/AIChatWidget';
import { ServiceWorkerRegistrar } from '@/components/pwa/ServiceWorkerRegistrar';
import { InstallPromptBanner } from '@/components/pwa/InstallPromptBanner';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Staffup LMS',
    template: '%s | Staffup LMS',
  },
  description: 'Staffup LMS — A modern learning management system for teams and organizations.',
  manifest: '/manifest.webmanifest',
  applicationName: 'StaffUp LMS',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'StaffUp',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export const viewport = {
  themeColor: '#1677ff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=optional"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body
        className="bg-background text-foreground flex min-h-full flex-col font-sans"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
          <AIChatWidget />
          <ToastProvider />
          <ServiceWorkerRegistrar />
          <InstallPromptBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
