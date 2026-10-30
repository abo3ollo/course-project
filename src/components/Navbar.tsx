"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { LogOut, GraduationCap, DollarSign, ShieldAlert, BookOpen, Users, Languages } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import NotificationBell from "./NotificationBell";
import { useLanguage } from "../context/LanguageContext";
import Image from "next/image";

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    toast.success(t("Logged out successfully"));
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="border-b border-graphite bg-obsidian sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo & Main Links */}
        <div className="flex items-center gap-10">
          {/* اللوجو */}
          <Link href="/" className="flex items-center gap-3 text-2xl font-serif text-white tracking-wide group">
            <div className="bg-carbon border border-graphite rounded-xl p-1 group-hover:border-copper transition-colors overflow-hidden flex items-center justify-center w-10 h-10">
              <Image
                src="/ebda3-logo.png"
                alt="EBDA3 Logo"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="group-hover:text-copper transition-colors">{t("EBDA3")}</span>
          </Link>

          {/* روابط التنقل (Nav Links) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-6">

              {/* 1️⃣ روابط الأدمن */}
              {user?.role === "ADMIN" && (
                <>
                  <Link
                    href="/admin"
                    className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${pathname === '/admin' ? 'text-copper' : 'text-copper/70 hover:text-copper'}`}
                  >
                    <ShieldAlert size={16} />
                    {t("Admin Dashboard")}
                  </Link>
                  <Link
                    href="/admin/enrollments"
                    className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${pathname === '/admin/enrollments' ? 'text-copper' : 'text-copper/70 hover:text-copper'}`}
                  >
                    <Users size={16} />
                    {t("Enrollments")}
                  </Link>
                </>
              )}

              {/* 2️⃣ روابط المعلم */}
              {user?.role === "INSTRUCTOR" && (
                <>
                  <Link
                    href="/instructor/revenue"
                    className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${pathname === '/instructor/revenue' ? 'text-copper' : 'text-fog hover:text-white'}`}
                  >
                    <DollarSign size={16} />
                    {t("My Revenue")}
                  </Link>
                  <Link
                    href="/courses"
                    className={`text-sm font-medium transition-colors ${pathname === '/courses' ? 'text-white' : 'text-fog hover:text-white'}`}
                  >
                    {t("Browse Catalog")}
                  </Link>
                </>
              )}

              {/* 3️⃣ روابط الطالب */}
              {user?.role === "USER" && (
                <>
                  <Link
                    href="/my-courses"
                    className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${pathname === '/my-courses' ? 'text-white' : 'text-fog hover:text-white'}`}
                  >
                    <BookOpen size={16} />
                    {t("My Courses")}
                  </Link>
                  <Link
                    href="/courses"
                    className={`text-sm font-medium transition-colors ${pathname === '/courses' ? 'text-white' : 'text-fog hover:text-white'}`}
                  >
                    {t("Browse Catalog")}
                  </Link>
                </>
              )}

            </div>
          )}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-5">
          <Button
            type="button"
            variant="outline"
            onClick={toggleLanguage}
            aria-label={language === "en" ? t("Switch to Arabic") : t("Switch to English")}
            className="rounded-full bg-transparent text-fog border-slate hover:text-white hover:bg-carbon hover:border-smoke transition-all"
          >
            <Languages size={16} />
            {language === "en" ? "العربية" : "English"}
          </Button>
          {isLoading ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-graphite bg-carbon">
                <Skeleton className="w-7 h-7 rounded-full bg-graphite" />
                <Skeleton className="h-4 w-20 bg-graphite" />
              </div>
              <Skeleton className="h-9 w-24 rounded-full bg-graphite" />
            </div>
          ) : isAuthenticated ? (
            <>
              <NotificationBell />

              {/* بروفايل اليوزر */}
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-graphite bg-carbon hover:border-slate transition-colors"
              >
                {user?.avatar && !user.avatar.includes('default-avatar') ? (
                  <img
                    src={user.avatar || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"}
                    alt={t("Avatar")}
                    className="w-7 h-7 rounded-full object-cover border border-slate"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-graphite text-copper flex items-center justify-center font-bold text-xs border border-slate">
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-bone">
                  {user?.firstName}
                </span>
              </Link>

              {/* زرار تسجيل الخروج */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-full bg-transparent text-fog border-slate hover:text-white hover:bg-carbon hover:border-smoke transition-all hidden sm:flex"
              >
                <LogOut size={16} />
                {t("Logout")}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-fog hover:text-white transition-colors">
                {t("Login")}
              </Link>
              <Link href="/register">
                <Button className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-6">
                  {t("Sign Up")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}