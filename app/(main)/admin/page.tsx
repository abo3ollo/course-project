"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, BookOpen, Trash2, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/src/context/LanguageContext";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"users" | "courses">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // حماية الصفحة
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  // جلب البيانات
  useEffect(() => {
    if (user?.role === "ADMIN") {
      const fetchData = async () => {
        setIsDataLoading(true);
        try {
          const usersRes = await api.get("/users");
          const coursesRes = await api.get("/courses");
          setUsers(usersRes.data.data.users);
          setCourses(coursesRes.data.data.courses);
        } catch (err) {
          toast.error(t("Failed to load dashboard data"));
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t("Are you sure you want to delete this user?"))) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
      toast.success(t("User deleted"));
    } catch (err) {
      toast.error(t("Failed to delete user"));
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm(t("Are you sure you want to delete this course?"))) return;
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
      toast.success(t("Course deleted"));
    } catch (err) {
      toast.error(t("Failed to delete course"));
    }
  };

  if (isLoading || user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-obsidian text-bone font-sans pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Skeleton */}
          <div className="mb-10 border-b border-graphite pb-8 flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-full bg-carbon" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-64 bg-carbon" />
              <Skeleton className="h-4 w-80 bg-carbon" />
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-10 w-32 rounded-full bg-carbon" />
            <Skeleton className="h-10 w-32 rounded-full bg-carbon" />
          </div>

          {/* Table Skeleton */}
          <div className="bg-onyx border border-graphite rounded-[10px] overflow-hidden">
            {/* Table Header */}
            <div className="bg-carbon border-b border-graphite flex px-6 py-4 gap-6">
              <Skeleton className="h-4 w-1/4 bg-graphite" />
              <Skeleton className="h-4 w-1/4 bg-graphite" />
              <Skeleton className="h-4 w-1/4 bg-graphite" />
              <Skeleton className="h-4 w-1/4 bg-graphite" />
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-graphite">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center px-6 py-4 gap-6">
                  {/* Name & Avatar */}
                  <div className="w-1/4 flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full bg-carbon" />
                    <Skeleton className="h-4 w-24 bg-carbon" />
                  </div>
                  {/* Email */}
                  <div className="w-1/4">
                    <Skeleton className="h-4 w-32 bg-carbon" />
                  </div>
                  {/* Role */}
                  <div className="w-1/4">
                    <Skeleton className="h-6 w-20 rounded-full bg-carbon" />
                  </div>
                  {/* Actions */}
                  <div className="w-1/4 flex justify-end">
                    <Skeleton className="h-8 w-8 rounded-md bg-carbon" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 border-b border-graphite pb-8 flex items-center gap-4">
          <div className="bg-copper/10 p-3 rounded-full border border-copper/30">
            <ShieldAlert className="text-copper w-8 h-8" />
          </div>
          <div>
            <h1 className="font-serif text-4xl text-white">{t("Admin Dashboard")}</h1>
            <p className="text-fog mt-1">{t("Manage platform users and courses.")}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-onyx p-1.5 rounded-full border border-graphite w-fit">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === "users"
                ? "bg-carbon text-white shadow-sm border border-slate"
                : "text-fog hover:text-white hover:bg-carbon/50 border border-transparent"
            }`}
          >
            <Users
              size={16}
              className={activeTab === "users" ? "text-copper" : ""}
            />
            {t("Users")}
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === "courses"
                ? "bg-carbon text-white shadow-sm border border-slate"
                : "text-fog hover:text-white hover:bg-carbon/50 border border-transparent"
            }`}
          >
            <BookOpen
              size={16}
              className={activeTab === "courses" ? "text-copper" : ""}
            />
            {t("Courses")}
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-onyx border border-graphite rounded-[10px] overflow-hidden">
          {isDataLoading ? (
            <div className="w-full">
              {/* Table Header Skeleton */}
              <div className="bg-carbon border-b border-graphite flex px-6 py-4 gap-6">
                <Skeleton className="h-4 w-1/4 bg-graphite" />
                <Skeleton className="h-4 w-1/4 bg-graphite" />
                <Skeleton className="h-4 w-1/4 bg-graphite" />
                <Skeleton className="h-4 w-1/4 bg-graphite" />
              </div>

              {/* Table Rows Skeleton */}
              <div className="divide-y divide-graphite">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center px-6 py-4 gap-6">
                    {/* العمود الأول: الاسم والصورة */}
                    <div className="w-1/4 flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full bg-carbon shrink-0" />
                      <Skeleton className="h-4 w-3/4 bg-carbon" />
                    </div>

                    {/* العمود الثاني: الإيميل أو اسم المدرس */}
                    <div className="w-1/4">
                      <Skeleton className="h-4 w-5/6 bg-carbon" />
                    </div>

                    {/* العمود الثالث: الرتبة أو السعر */}
                    <div className="w-1/4">
                      <Skeleton className="h-6 w-20 rounded-full bg-carbon" />
                    </div>

                    {/* العمود الرابع: الأكشنز (زرار المسح) */}
                    <div className="w-1/4 flex justify-end">
                      <Skeleton className="h-8 w-8 rounded-md bg-carbon" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "users" ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-carbon border-b border-graphite text-fog">
                <tr>
                  <th className="px-6 py-4 font-medium">{t("Name")}</th>
                  <th className="px-6 py-4 font-medium">{t("Email")}</th>
                  <th className="px-6 py-4 font-medium">{t("Role")}</th>
                  <th className="px-6 py-4 font-medium text-right">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite">
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-carbon/50 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={t("Avatar")}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-graphite flex items-center justify-center text-copper font-bold">
                          {u.firstName?.charAt(0)}
                        </div>
                      )}
                      <span className="text-white font-medium">
                        {u.firstName} {u.lastName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-fog">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === "ADMIN"
                            ? "bg-red-400/10 text-red-400 border border-red-400/20"
                            : u.role === "INSTRUCTOR"
                              ? "bg-copper/10 text-copper border border-copper/20"
                              : "bg-green-400/10 text-green-400 border border-green-400/20"
                        }`}
                      >
                        {t(u.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        onClick={() => handleDeleteUser(u._id)}
                        variant="ghost"
                        size="sm"
                        className="text-fog hover:text-red-400 hover:bg-red-400/10"
                        disabled={u._id === user?._id} // مينفعش الأدمن يمسح نفسه
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-carbon border-b border-graphite text-fog">
                <tr>
                  <th className="px-6 py-4 font-medium">{t("Course Title")}</th>
                  <th className="px-6 py-4 font-medium">{t("Instructor")}</th>
                  <th className="px-6 py-4 font-medium">{t("Price")}</th>
                  <th className="px-6 py-4 font-medium">{t("Status")}</th>
                  <th className="px-6 py-4 font-medium text-right">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite">
                {courses.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-carbon/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {c.title}
                    </td>
                    <td className="px-6 py-4 text-fog">
                      {c.instructor?.firstName} {c.instructor?.lastName}
                    </td>
                    <td className="px-6 py-4 text-copper">${c.price}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${c.isPublished ? "bg-green-400/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}
                      >
                        {c.isPublished ? t("Published") : t("Draft")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        onClick={() => handleDeleteCourse(c._id)}
                        variant="ghost"
                        size="sm"
                        className="text-fog hover:text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
