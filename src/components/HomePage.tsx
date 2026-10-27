"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { toast } from "sonner";
import StudentDashboard from "@/src/components/dashboards/StudentDashboard";
import InstructorDashboard from "@/src/components/dashboards/InstructorDashboard";
import AdminDashboard from "@/src/components/dashboards/AdminDashboard";

export default function HomePage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          if (user?.role === "ADMIN") {
            // ممكن نعمل API مخصص للأدمن أو نستخدم اللي موجود
            const res = await api.get("/courses/admin/dashboard-stats"); 
            setStats(res.data.data);
          } else if (user?.role === "INSTRUCTOR") {
            const res = await api.get("/courses/instructor-stats");
            setStats(res.data.data);
          } else {
            const res = await api.get("/courses/dashboard-stats");
            setStats(res.data.data);
          }
        } catch (err) {
          console.error("Failed to load stats", err);
          toast.error("Failed to load dashboard data");
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchData();
    } else if (!isAuthLoading) {
      setIsDataLoading(false);
    }
  }, [isAuthenticated, isAuthLoading, user]);

  // ── Skeleton Loading ──
  if (isAuthLoading || (isAuthenticated && isDataLoading)) {
    return (
      <div className="min-h-screen bg-obsidian text-bone font-sans pb-20 selection:bg-copper selection:text-white">
        <div className="max-w-6xl mx-auto px-6 pt-16 space-y-16">
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-graphite pb-10">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32 bg-carbon" />
              <Skeleton className="h-14 w-75 md:w-112.5 bg-carbon" />
            </div>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-4 w-28 bg-carbon" />
                  <Skeleton className="h-5 w-5 rounded-full bg-carbon" />
                </div>
                <Skeleton className="h-12 w-16 bg-carbon" />
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  }

  // ── واجهة الزائر ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] bg-obsidian flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-copper/5 rounded-full blur-3xl pointer-events-none"></div>
        <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 tracking-wide z-10">
          Master Your Craft.
        </h1>
        <p className="text-fog text-lg md:text-xl max-w-2xl mb-12 z-10">
          Join an exclusive platform to learn from industry experts and elevate your skills.
        </p>
        <div className="flex gap-4 z-10">
          <Link href="/register" className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition">
            Get Started
          </Link>
          <Link href="/login" className="border border-[#777a88] text-white px-8 py-3 rounded-full font-medium hover:bg-white/5 transition">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // ── توجيه المستخدم للمكون المناسب ──
  if (user?.role === "ADMIN") {
    return <AdminDashboard user={user} stats={stats} />;
  }

  if (user?.role === "INSTRUCTOR") {
    return <InstructorDashboard user={user} stats={stats} />;
  }

  return <StudentDashboard user={user} stats={stats} />;
}