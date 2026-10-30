 "use client";

import Link from "next/link";
import { ArrowLeft, Ghost } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans flex flex-col items-center justify-center relative overflow-hidden px-4 selection:bg-copper selection:text-white">
      
      {/* تأثير توهج نحاسي في الخلفية */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-copper/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 text-center space-y-6 max-w-lg mx-auto">
        {/* الأيقونة */}
        <div className="flex justify-center mb-8">
          <div className="bg-carbon border border-graphite p-6 rounded-full">
            <Ghost size={64} className="text-copper animate-pulse" />
          </div>
        </div>

        {/* الرقم 404 */}
        <h1 className="font-serif text-[120px] md:text-[180px] leading-none text-white tracking-tighter">
          4<span className="text-copper">0</span>4
        </h1>

        {/* النص */}
        <h2 className="font-serif text-3xl md:text-4xl text-white">
          {t("Page Not Found")}
        </h2>
        <p className="text-fog text-lg">
          {t("The page you are looking for doesn't exist or has been moved. Let's get you back on track.")}
        </p>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            href="/"
            className="w-full sm:w-auto bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            {t("Back to Home")}
          </Link>
          <Link
            href="/courses"
            className="w-full sm:w-auto border border-[#777a88] text-white px-8 py-3 rounded-full font-medium hover:bg-white/5 transition-colors"
          >
            {t("Browse Courses")}
          </Link>
        </div>
      </div>
    </div>
  );
}