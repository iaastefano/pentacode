import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/GoogleTagManager";
import "@/app/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Pentacode | Desarrollo Web Profesional",
  description:
    "Transformamos tu idea en una web de alto impacto. Desarrollo web a medida con entregas semanales. Contanos tu idea y nosotros nos encargamos de todo.",
  keywords: ["desarrollo web", "páginas web", "aplicaciones", "software", "pentacode", "argentina"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Pentacode | Desarrollo Web Profesional",
    description: "Tu idea, nuestra especialidad. Contanos tu proyecto y nosotros nos encargamos de todo.",
    type: "website",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "es" | "en" | "pt")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`scroll-smooth ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <GoogleTagManager />
      </head>
      <body className="font-sans bg-brand-dark text-white overflow-x-hidden">
        <GoogleTagManagerNoScript />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
