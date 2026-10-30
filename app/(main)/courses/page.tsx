"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { BookOpen, Tag, Star, Search, Filter } from "lucide-react";
import { Course } from "@/src/types";
import { useAuth } from "@/src/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/src/context/LanguageContext";

export default function CoursesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ States للفلترة والبحث
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("-createdAt");

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        // بناء الـ URL بناءً على الفلاتر
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (category) params.append("category", category);
        if (level) params.append("level", level);
        if (sort) params.append("sort", sort);

        const res = await api.get(`/courses?${params.toString()}`);
        
        // بنعرض الكورسات المنشورة بس
        const publishedCourses = res.data.data.courses.filter(
          (course: Course) => course.isPublished
        );
        setCourses(publishedCourses);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce عشان ميعملش request مع كل حرف (يستنى اليوزر يخلص كتابة)
    const timer = setTimeout(() => {
      fetchCourses();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, category, level, sort]);

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-graphite pb-8">
          <div className="text-center md:text-left">
            <h1 className="font-serif text-4xl text-white">{t("Browse Catalog")}</h1>
            <p className="text-fog mt-3 max-w-xl">
              {t("Discover new skills and expand your knowledge with our top-rated courses.")}
            </p>
          </div>

          {(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
            <Link href="/courses/create">
              <Button className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-6 w-full md:w-auto">
                {t("+ Create Course")}
              </Button>
            </Link>
          )}
        </div>

        {/* ✅ Search & Filters Bar */}
        <div className="bg-onyx border border-graphite rounded-[10px] p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fog rtl:left-auto rtl:right-3" size={18} />
            <Input
              type="text"
              placeholder={t("Search for courses...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rtl:pl-3 rtl:pr-10 bg-carbon border-graphite text-white placeholder:text-fog focus-visible:ring-copper h-11"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-auto h-11 rounded-md border border-graphite bg-carbon px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-copper"
          >
            <option value="">{t("All Categories")}</option>
            <option value="Programming">{t("Programming")}</option>
            <option value="Design">{t("Design")}</option>
            <option value="Business">{t("Business")}</option>
          </select>

          {/* Level Filter */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full md:w-auto h-11 rounded-md border border-graphite bg-carbon px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-copper"
          >
            <option value="">{t("All Levels")}</option>
            <option value="Beginner">{t("Beginner")}</option>
            <option value="Intermediate">{t("Intermediate")}</option>
            <option value="Advanced">{t("Advanced")}</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full md:w-auto h-11 rounded-md border border-graphite bg-carbon px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-copper"
          >
            <option value="-createdAt">{t("Newest")}</option>
            <option value="price">{t("Price: Low to High")}</option>
            <option value="-price">{t("Price: High to Low")}</option>
            <option value="-ratingsAverage">{t("Highest Rated")}</option>
          </select>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-copper"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24 bg-onyx rounded-[10px] border border-graphite">
            <Filter className="mx-auto h-12 w-12 text-[#2e3038] mb-4" />
            <h3 className="text-lg font-medium text-white">{t("No courses found")}</h3>
            <p className="text-fog mt-1">{t("Try adjusting your search or filters.")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                href={`/courses/${course._id}`}
                className="group flex flex-col bg-onyx rounded-[10px] border border-graphite overflow-hidden hover:border-[#2e3038] transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-carbon/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-copper border border-[#2e3038]">
                    ${course.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow">
                  <div className="flex items-center gap-2 text-xs font-semibold text-copper mb-3 tracking-wider uppercase">
                    <Tag size={12} />
                    <span>{t(course.category)}</span>
                    <span className="text-[#464853]">•</span>
                    <span>{t(course.level)}</span>
                  </div>

                  <h2 className="font-serif text-xl text-white mb-2 line-clamp-2 leading-snug group-hover:text-copper transition-colors">
                    {course.title}
                  </h2>

                  <p className="text-sm text-fog line-clamp-2 mb-4 grow">
                    {course.description}
                  </p>

                  {/* Ratings */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-copper font-bold text-sm">
                      {course.ratingsAverage || "4.5"}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.round(course.ratingsAverage || 4.5)
                              ? "text-copper fill-copper"
                              : "text-[#464853]"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-fog">
                      ({course.ratingsQuantity || 0})
                    </span>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-graphite">
                    {course.instructor?.avatar ? (
                      <img
                        src={course.instructor.avatar}
                        alt={t("Instructor")}
                        className="w-7 h-7 rounded-full object-cover border border-[#2e3038]"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-graphite text-copper flex items-center justify-center text-xs font-bold border border-[#2e3038]">
                        {course.instructor?.firstName?.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm text-bone">
                      {course.instructor?.firstName} {course.instructor?.lastName}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}