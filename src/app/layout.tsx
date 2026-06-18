import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/session-provider";
import { Toaster } from "sonner";
import { SCHOOL_INFO } from "@/lib/school-data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: `${SCHOOL_INFO.name} | ${SCHOOL_INFO.tagline}`,
    template: `%s | ${SCHOOL_INFO.name}`,
  },
  description:
    "Little Champs School - A premier educational institution nurturing tomorrow's leaders with excellence in academics, sports, and character development.",
  keywords: [
    "school",
    "education",
    "CBSE",
    "Mumbai",
    "Little Champs School",
    "admissions",
  ],
  authors: [{ name: SCHOOL_INFO.name }],
  openGraph: {
    title: SCHOOL_INFO.name,
    description: SCHOOL_INFO.tagline,
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
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
