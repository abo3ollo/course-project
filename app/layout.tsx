import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // ✅ غيرنا الخطوط هنا
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/src/context/AuthContext";
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

export const metadata: Metadata = {
  title: {
    default: "Courses Platform | Master Your Craft",
    template: "%s | Courses Platform" // ✅ بيضيف اسم الموقع تلقائي لأي صفحة
  },
  description: "Join an exclusive platform to learn from industry experts and elevate your skills.",
  keywords: ["courses", "learning", "programming", "design", "online courses"],
  authors: [{ name: "Courses Platform" }],
  openGraph: {
    title: "Courses Platform",
    description: "Learn from industry experts and elevate your skills.",
    url: "https://course-project-full.vercel.app",
    siteName: "Courses Platform",
    images: [
      {
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", // صورة افتراضية
        width: 1200,
        height: 630,
        alt: "Courses Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Courses Platform",
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      {/* ✅ ضفنا bg-[#08080a] و text-[#e2e3e9] كخلفية أساسية للموقع */}
      <body className="min-h-full flex flex-col bg-obsidian text-bone font-sans">
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster richColors position="top-center" theme="dark" />
        </AuthProvider>
      </body>
    </html>
  );
}