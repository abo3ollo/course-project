"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, DollarSign, Wallet } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

export default function AdminFinancialsPage() {
  const { t } = useLanguage();
  const [financials, setFinancials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        const res = await api.get("/courses/admin/instructors-financials");
        setFinancials(res.data.data.financials);
      } catch (err) {
        console.error("Failed to fetch financials", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFinancials();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian text-bone p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-10 w-64 bg-carbon" />
          <div className="bg-onyx border border-graphite rounded-[10px] p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full bg-carbon mb-4 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // إجمالي أرباح المنصة
  const totalPlatformRevenue = financials.reduce((acc, curr) => acc + curr.platformCut, 0);

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-graphite pb-6">
          <div>
            <h1 className="font-serif text-4xl text-white">{t("Instructors Financials")}</h1>
            <p className="text-fog mt-1">{t("Overview of all instructors revenue and platform fees.")}</p>
          </div>
          <div className="bg-copper/10 border border-copper/30 rounded-xl p-4 flex items-center gap-4">
            <div className="bg-copper/20 p-3 rounded-full">
              <DollarSign className="text-copper" size={24} />
            </div>
            <div>
              <p className="text-sm text-copper font-medium">{t("Total Platform Revenue")}</p>
              <p className="text-2xl font-bold text-white">${totalPlatformRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-onyx border border-graphite rounded-[10px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-carbon border-b border-graphite text-fog">
                <tr>
                  <th className="px-6 py-4 font-medium">{t("Instructor")}</th>
                  <th className="px-6 py-4 font-medium">{t("Courses")}</th>
                  <th className="px-6 py-4 font-medium">{t("Students")}</th>
                  <th className="px-6 py-4 font-medium">{t("Total Sales")}</th>
                  <th className="px-6 py-4 font-medium text-copper">{t("Platform Cut (15%)")}</th>
                  <th className="px-6 py-4 font-medium text-green-400">{t("Instructor Cut (85%)")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite">
                {financials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-fog">{t("No instructors found.")}</td>
                  </tr>
                ) : (
                  financials.map((inst) => (
                    <tr key={inst._id} className="hover:bg-carbon/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {inst.avatar ? (
                            <img src={inst.avatar} alt={t("Avatar")} className="w-9 h-9 rounded-full object-cover border border-graphite" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-graphite text-copper flex items-center justify-center font-bold">
                              {inst.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium">{inst.name}</p>
                            <p className="text-xs text-fog">{inst.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-fog">
                          <BookOpen size={14} /> {inst.totalCourses}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-fog">
                          <Users size={14} /> {inst.totalStudents}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        ${inst.totalSales.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-copper font-medium">
                        ${inst.platformCut.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-green-400 font-bold">
                          <Wallet size={16} /> ${inst.instructorCut.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}