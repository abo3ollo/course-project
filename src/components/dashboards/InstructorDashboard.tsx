"use client";

import Link from "next/link";
import { BookOpen, Users, Award, LayoutDashboard, PlusCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/src/context/LanguageContext";

export default function InstructorDashboard({ user, stats }: { user: any, stats: any }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20 selection:bg-copper selection:text-white">
      <div className="max-w-6xl mx-auto px-6 pt-16 space-y-16">
        
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-graphite pb-10">
          <div>
            <p className="text-copper text-sm font-semibold tracking-widest uppercase mb-3">
              {t("Instructor Dashboard")}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
              {t("Welcome, {name}.", { name: user?.firstName ?? "" })}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-fog">
            <LayoutDashboard size={16} />
            <span>{t("Manage your courses and students")}</span>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-fog text-sm font-medium">{t("Total Courses")}</span>
              <BookOpen size={20} className="text-copper" />
            </div>
            <div className="font-serif text-5xl text-white">{stats?.totalCourses || 0}</div>
          </div>

          <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-fog text-sm font-medium">{t("Enrolled Students")}</span>
              <Users size={20} className="text-copper" />
            </div>
            <div className="font-serif text-5xl text-white">{stats?.totalStudents || 0}</div>
          </div>

          <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-fog text-sm font-medium">{t("Average Rating")}</span>
              <Award size={20} className="text-copper" />
            </div>
            <div className="font-serif text-5xl text-white">{stats?.avgRating || "0.0"}</div>
          </div>
        </section>

        {/* Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-serif text-2xl text-white">{t("Your Top Courses")}</h2>
            <div className="bg-onyx border border-graphite rounded-[10px] p-8 text-center flex flex-col items-center justify-center h-45">
              <p className="text-fog mb-4">{t("Manage your existing courses or create a new one.")}</p>
              <Link href="/courses/create">
                <Button className="bg-copper text-white hover:bg-copper/90 rounded-full px-6">{t("+ Create New Course")}</Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <h2 className="font-serif text-2xl text-white">{t("Quick Actions")}</h2>
            <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col gap-4">
              <Link href="/courses/create" className="w-full bg-white text-black text-center py-3 rounded-full font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                <PlusCircle size={18} /> Create Course
              </Link>
              <Link href="/instructor/revenue" className="w-full bg-copper/10 text-copper border border-copper/30 text-center py-3 rounded-full font-medium hover:bg-copper/20 transition flex items-center justify-center gap-2">
                <DollarSign size={18} /> {t("My Revenue")}
              </Link>
              <Link href="/profile" className="w-full border border-[#777a88] text-white text-center py-3 rounded-full font-medium hover:bg-white/5 transition">
                {t("Profile Settings")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}