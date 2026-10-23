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
  title: "Course Project",
  description: "Full Stack Course Project",
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