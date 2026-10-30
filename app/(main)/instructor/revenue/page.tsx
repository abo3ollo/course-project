"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { DollarSign, Users, BookOpen } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

export default function InstructorRevenuePage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      const res = await api.get("/courses/instructor/revenue");
      setStats(res.data.data);
    };
    fetchRevenue();
  }, []);

  if (!stats) return <div className="text-center py-20 text-white">{t("Loading...")}</div>;

  return (
    <div className="min-h-screen bg-obsidian text-bone p-8">
      <h1 className="font-serif text-4xl text-white mb-8">{t("My Revenue")}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-onyx border border-graphite p-6 rounded-lg">
          <p className="text-fog mb-2">{t("Net Revenue (85%)")}</p>
          <h2 className="text-4xl font-serif text-copper">${stats.netRevenue}</h2>
        </div>
        <div className="bg-onyx border border-graphite p-6 rounded-lg">
          <p className="text-fog mb-2">{t("Platform Fee (15%)")}</p>
          <h2 className="text-4xl font-serif text-white">${stats.totalPlatformFee}</h2>
        </div>
        <div className="bg-onyx border border-graphite p-6 rounded-lg">
          <p className="text-fog mb-2">{t("Total Students")}</p>
          <h2 className="text-4xl font-serif text-white">{stats.totalStudents}</h2>
        </div>
      </div>
    </div>
  );
}