import type { Metadata } from "next";
import { Nunito, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/session-provider";
import { Toaster } from "sonner";
import { SCHOOL_INFO } from "@/lib/school-data";
import "./globals.css";

function siteUrl() {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SCHOOL_INFO.name} | ${SCHOOL_INFO.tagline}`,
    template: `%s | ${SCHOOL_INFO.name}`,
  },
  description:
    "Little Champs School - Quality education from Nursery to Class 8 in Bhiwandi. A friendly, modern preschool and primary school nurturing young minds with love and excellence.",
  keywords: [
    "school",
    "preschool",
    "primary school",
    "Bhiwandi",
    "Little Champs School",
    "admissions",
    "Nursery",
  ],
  authors: [{ name: SCHOOL_INFO.name }],
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
  openGraph: {
    title: SCHOOL_INFO.name,
    description: SCHOOL_INFO.tagline,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/images/Little champs school.jpeg", width: 1200, height: 630, alt: SCHOOL_INFO.name }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} ${jakarta.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
