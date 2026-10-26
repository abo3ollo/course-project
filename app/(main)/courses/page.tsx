"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { BookOpen, Tag } from "lucide-react";
import { Course } from "@/src/types";
import { useAuth } from "@/src/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
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

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian text-bone font-sans pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header Skeleton */}
          <div className="mb-12 border-b border-graphite pb-8">
            <Skeleton className="h-10 w-48 bg-carbon mb-3" />
            <Skeleton className="h-4 w-80 bg-carbon" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="flex flex-col bg-onyx rounded-[10px] border border-graphite overflow-hidden"
              >
                {/* Thumbnail Skeleton */}
                <div className="relative h-52 w-full">
                  <Skeleton className="w-full h-full bg-carbon rounded-none" />
                </div>

                {/* Content Skeleton */}
                <div className="p-6 flex flex-col grow">
                  {/* Category */}
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="h-3 w-3 rounded-full bg-carbon" />
                    <Skeleton className="h-3 w-20 bg-carbon" />
                  </div>

                  {/* Title */}
                  <Skeleton className="h-6 w-full bg-carbon mb-2" />
                  <Skeleton className="h-6 w-2/3 bg-carbon mb-4" />
                  
                  {/* Instructor */}
                  <div className="flex items-center gap-3 mt-auto">
                    <Skeleton className="w-6 h-6 rounded-full bg-carbon" />
                    <Skeleton className="h-4 w-24 bg-carbon" />
                  </div>

                  {/* Button */}
                  <div className="mt-6 pt-6 border-t border-graphite">
                    <Skeleton className="h-10 w-full rounded-full bg-carbon" />
                  </div>
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-graphite pb-8">
          <div className="text-center md:text-left">
            <h1 className="font-serif text-4xl text-white">Browse Catalog</h1>
            <p className="text-fog mt-3 max-w-xl">
              Discover new skills and expand your knowledge with our top-rated courses.
            </p>
          </div>

          {(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
            <Link href="/courses/create">
              <Button className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-6 w-full md:w-auto">
                + Create Course
              </Button>
            </Link>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-24 bg-onyx rounded-[10px] border border-graphite">
            <BookOpen className="mx-auto h-12 w-12 text-[#2e3038] mb-4" />
            <h3 className="text-lg font-medium text-white">No courses available</h3>
            <p className="text-fog mt-1">Check back later for new content.</p>
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
                    <span>{course.category}</span>
                    <span className="text-[#464853]">•</span>
                    <span>{course.level}</span>
                  </div>

                  <h2 className="font-serif text-xl text-white mb-3 line-clamp-2 leading-snug group-hover:text-copper transition-colors">
                    {course.title}
                  </h2>

                  <p className="text-sm text-fog line-clamp-2 mb-6 grow">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center gap-3 mt-auto pt-5 border-t border-graphite">
                    {course.instructor?.avatar ? (
                      <img
                        src={course.instructor.avatar}
                        alt="Instructor"
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