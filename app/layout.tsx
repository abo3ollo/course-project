import type { Metadata } from "next";
import { Inter, Playfair_Display , Cairo } from "next/font/google"; // ✅ غيرنا الخطوط هنا
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/src/context/AuthContext";
import { LanguageProvider } from "@/src/context/LanguageContext";
import Navbar from "@/src/components/Navbar";

// خط Sans (للنصوص والأزرار)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// خط Serif (للعناوين الكبيرة)
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cairo = Cairo({ subsets: ["arabic" , "latin"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: {
    default: "EBDA3 | Master Your Craft",
    template: "%s | EBDA3" // ✅ بيضيف اسم الموقع تلقائي لأي صفحة
  },
  description: "Join an exclusive platform to learn from industry experts and elevate your skills.",
  keywords: ["courses", "learning", "programming", "design", "online courses"],
  authors: [{ name: "EBDA3" }],
  openGraph: {
    title: "EBDA3",
    description: "Learn from industry experts and elevate your skills.",
    url: "https://ebda3-chi.vercel.app",
    siteName: "EBDA3",
    images: [
      {
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", // صورة افتراضية
        width: 1200,
        height: 630,
        alt: "EBDA3",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EBDA3",
    description: "Learn from industry experts.",
    images: ["https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${cairo.variable} h-full antialiased`}
    >
      {/* ✅ ضفنا bg-[#08080a] و text-[#e2e3e9] كخلفية أساسية للموقع */}
      <body className="min-h-full flex flex-col bg-obsidian text-bone font-sans">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <Toaster richColors position="top-center" theme="dark" />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}