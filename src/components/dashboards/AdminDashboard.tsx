"use client";

import Link from "next/link";
import { Users, BookOpen, ShieldAlert, DollarSign, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/src/context/LanguageContext";

export default function AdminDashboard({ user, stats }: { user: any, stats: any }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20 selection:bg-copper selection:text-white">
      <div className="max-w-6xl mx-auto px-6 pt-16 space-y-16">

        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-graphite pb-10">
          <div>
            <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-3 flex items-center gap-2">
              <ShieldAlert size={16} /> {t("Admin Control Panel")}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
              {t("Welcome, {name}.", { name: user?.firstName ?? "" })}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-fog">
            <LayoutDashboard size={16} />
            <span>{t("Manage the entire platform")}</span>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-fog text-sm font-medium">{t("Total Users")}</span>
              <Users size={20} className="text-copper" />
            </div>
            <div className="font-serif text-5xl text-white">{stats?.totalUsers || 0}</div>
          </div>

          <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-fog text-sm font-medium">{t("Total Courses")}</span>
              <BookOpen size={20} className="text-copper" />
            </div>
            <div className="font-serif text-5xl text-white">{stats?.totalCourses || 0}</div>
          </div>

          <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-fog text-sm font-medium">{t("Platform Revenue")}</span>
              <DollarSign size={20} className="text-copper" />
            </div>
            <div className="font-serif text-5xl text-white">${stats?.platformRevenue || 0}</div>
          </div>
        </section>

        {/* Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-white">{t("Management")}</h2>
            <div className="bg-onyx border border-graphite rounded-[10px] p-8 flex flex-col items-center justify-center h-auto min-h-45 gap-4">
              <p className="text-fog text-center">{t("Manage users, courses, and approve pending payments.")}</p>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link href="/admin">
                  <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6 w-full">
                    {t("Go to Admin Dashboard")}
                  </Button>
                </Link>

                <Link href="/admin/enrollments">
                  <Button className="bg-copper text-white hover:bg-copper/90 rounded-full px-6 w-full">
                    {t("Pending Enrollments")}
                  </Button>
                </Link>

                <Link href="/admin/financials">
                  <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6 w-full">
                    {t("Instructors Financials")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}