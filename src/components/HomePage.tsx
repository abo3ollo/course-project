"use client";

import Link from "next/link";

import { PlayCircle, BookOpen, Clock, ArrowRight, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";


export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian text-bone font-sans pb-20 selection:bg-copper selection:text-white">
        <div className="max-w-6xl mx-auto px-6 pt-16 space-y-16">
          
          {/* Header Section Skeleton */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-graphite pb-10">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32 bg-carbon" />
              <Skeleton className="h-14 w-75 md:w-112.5 bg-carbon" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full bg-carbon" />
              <Skeleton className="h-4 w-32 bg-carbon" />
            </div>
          </section>

          {/* Stats Grid Skeleton */}
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

          {/* Main Action Area Skeleton */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
            
            {/* Continue Learning Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48 bg-carbon" />
                <Skeleton className="h-4 w-16 bg-carbon" />
              </div>

              <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col md:flex-row gap-6">
                <Skeleton className="w-full md:w-48 h-32 rounded-md bg-carbon shrink-0" />
                <div className="flex flex-col justify-center grow space-y-3">
                  <Skeleton className="h-3 w-24 bg-carbon" />
                  <Skeleton className="h-6 w-3/4 bg-carbon" />
                  <div className="w-full pt-4">
                    <Skeleton className="h-1.5 w-full rounded-full bg-carbon" />
                    <Skeleton className="h-3 w-20 mt-2 bg-carbon" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="lg:col-span-1 space-y-6">
              <Skeleton className="h-8 w-40 bg-carbon" />
              <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col gap-4">
                <Skeleton className="h-12 w-full rounded-full bg-carbon" />
                <Skeleton className="h-12 w-full rounded-full bg-carbon" />
              </div>
            </div>

          </section>
        </div>
      </div>
    );
  }

  // ── 1. واجهة الزائر (غير المسجل) ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] bg-obsidian flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        {/* خلفية جمالية (Glow) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-copper/5 rounded-full blur-3xl pointer-events-none"></div>

        <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 tracking-wide z-10">
          Master Your Craft.
        </h1>
        <p className="text-fog text-lg md:text-xl max-w-2xl mb-12 z-10">
          Join an exclusive platform to learn from industry experts and elevate your skills.
        </p>
        <div className="flex gap-4 z-10">
          <Link
            href="/register"
            className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="border border-[#777a88] text-white px-8 py-3 rounded-full font-medium hover:bg-white/5 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // ── 2. واجهة المستخدم المسجل (Slash Design) ──
  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20 selection:bg-copper selection:text-white">
      <div className="max-w-6xl mx-auto px-6 pt-16 space-y-16">

        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-graphite pb-10">
          <div>
            <p className="text-copper text-sm font-semibold tracking-widest uppercase mb-3">
              Dashboard
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
              Welcome back, {user?.firstName}.
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-fog">
            <Clock size={16} />
            <span>Last login: Just now</span>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat 1 */}
          <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-fog text-sm font-medium">Enrolled Courses</span>
              <BookOpen size={20} className="text-copper" />
            </div>
            <div className="font-serif text-5xl text-white">3</div>
          </div>

          {/* Stat 2 */}
          <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-fog text-sm font-medium">Hours Learned</span>
              <Clock size={20} className="text-copper" />
            </div>
            <div className="font-serif text-5xl text-white">12.5</div>
          </div>

          {/* Stat 3 */}
          <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-fog text-sm font-medium">Certificates</span>
              <Award size={20} className="text-copper" />
            </div>
            <div className="font-serif text-5xl text-white">1</div>
          </div>
        </section>

        {/* Main Action Area */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">

          {/* Continue Learning (Left Side) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-white">Continue Learning</h2>
              <Link href="/my-courses" className="text-sm text-copper hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {/* Card */}
            <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col md:flex-row gap-6 group hover:border-slate transition">
              <div className="w-full md:w-48 h-32 bg-carbon rounded-md overflow-hidden relative shrink-0">
                <Link href="/my-courses">
                  <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" alt="course" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="text-white/80 w-10 h-10 group-hover:scale-110 transition" />
                  </div>
                </Link>
              </div>
              <div className="flex flex-col justify-center grow">
                <span className="text-copper text-xs font-bold tracking-wider uppercase mb-2">Web Development</span>
                <h3 className="text-xl font-medium text-white mb-2">Advanced React & Next.js Masterclass</h3>
                <div className="w-full bg-graphite h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-copper h-full w-[45%]"></div>
                </div>
                <p className="text-xs text-steel mt-2">45% Completed</p>
              </div>
            </div>
          </div>

          {/* Quick Actions (Right Side) */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="font-serif text-2xl text-white">Quick Actions</h2>
            <div className="bg-onyx border border-graphite rounded-[10px] p-6 flex flex-col gap-4">
              <Link
                href="/courses"
                className="w-full bg-white text-black text-center py-3 rounded-full font-medium hover:bg-gray-200 transition"
              >
                Browse Catalog
              </Link>
              <Link
                href="/my-courses"
                className="w-full border border-[#777a88] text-white text-center py-3 rounded-full font-medium hover:bg-white/5 transition"
              >
                My Learning
              </Link>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}