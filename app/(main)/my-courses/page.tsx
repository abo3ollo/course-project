"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Course } from "@/src/types";
import { BookOpen, PlayCircle, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/src/context/LanguageContext";

export default function MyCoursesPage() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<any[]>([]); // استخدمنا any عشان نقبل paymentStatus
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/courses/my-courses");
        setCourses(res.data.data.courses);
      } catch (err) {
        console.error("Failed to fetch my courses", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian text-bone font-sans pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 border-b border-graphite pb-8">
            <Skeleton className="h-10 w-48 bg-carbon mb-3" />
            <Skeleton className="h-4 w-80 bg-carbon" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col bg-onyx rounded-[10px] border border-graphite overflow-hidden">
                <Skeleton className="h-52 w-full bg-carbon rounded-none" />
                <div className="p-6 flex flex-col grow space-y-3">
                  <Skeleton className="h-3 w-20 bg-carbon" />
                  <Skeleton className="h-6 w-full bg-carbon" />
                  <Skeleton className="h-6 w-2/3 bg-carbon" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="mb-12 border-b border-graphite pb-8">
          <h1 className="font-serif text-4xl text-white">{t("My Learning")}</h1>
          <p className="text-fog mt-2">{t("Track your enrollments and continue your learning journey.")}</p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-24 bg-onyx rounded-[10px] border border-graphite">
            <BookOpen className="mx-auto h-12 w-12 text-[#2e3038] mb-4" />
            <h3 className="text-lg font-medium text-white">{t("You don't have any courses yet")}</h3>
            <p className="text-fog mt-1 mb-6">{t("Explore our catalog and start learning today.")}</p>
            <Link href="/courses">
              <Button className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-8">
                {t("Browse Catalog")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const isApproved = course.paymentStatus === "approved";
              const isPending = course.paymentStatus === "pending";
              const isRejected = course.paymentStatus === "rejected";

              return (
                <div 
                  key={course._id}
                  className="group flex flex-col bg-onyx rounded-[10px] border border-graphite overflow-hidden hover:border-[#2e3038] transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    
                    {/* شارة الحالة */}
                    <div className="absolute top-3 right-3">
                      {isApproved && <span className="bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">{t("Enrolled")}</span>}
                      {isPending && <span className="bg-yellow-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">{t("Pending ⏳")}</span>}
                      {isRejected && <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">{t("Rejected ❌")}</span>}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col grow">
                    <div className="flex items-center gap-2 text-xs font-semibold text-copper mb-3 tracking-wider uppercase">
                      <Tag size={12} />
                      <span>{t(course.category)}</span>
                    </div>

                    <h2 className="text-xl font-serif text-white mb-2 line-clamp-2 leading-snug">
                      {course.title}
                    </h2>

                    {/* لو الكورس مقبول، نعرض شريط التقدم */}
                    {isApproved && (
                      <div className="mt-2 mb-4">
                        <div className="flex justify-between text-xs text-fog mb-1.5">
                          <span>{course.completedCount || 0} / {course.totalSections || 0} {t("sections")}</span>
                          <span className="text-copper font-bold">{course.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-graphite h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-copper h-full transition-all duration-500" 
                            style={{ width: `${course.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Instructor */}
                    <div className="flex items-center gap-3 text-sm text-fog mt-auto pt-4 border-t border-graphite">
                      {course.instructor?.avatar ? (
                        <img 
                          src={course.instructor.avatar} 
                          alt={t("Instructor")}
                          className="w-6 h-6 rounded-full object-cover border border-[#2e3038]" 
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-graphite text-copper flex items-center justify-center text-xs font-bold border border-[#2e3038]">
                          {course.instructor?.firstName?.charAt(0)}
                        </div>
                      )}
                      <span>{course.instructor?.firstName} {course.instructor?.lastName}</span>
                    </div>

                    <div className="mt-6 pt-6 border-t border-graphite">
                      {isApproved ? (
                        <Link href={`/courses/${course._id}/learn`}>
                          <Button className="w-full bg-carbon text-white border border-[#2e3038] hover:bg-graphite hover:border-copper transition-colors rounded-full font-medium">
                            {t("Continue Learning")}
                          </Button>
                        </Link>
                      ) : isPending ? (
                        <Button disabled className="w-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded-full font-medium">
                          {t("Pending Approval")}
                        </Button>
                      ) : (
                        <Link href={`/courses/${course._id}/checkout`}>
                          <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-medium">
                            {t("Upload New Receipt")}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}