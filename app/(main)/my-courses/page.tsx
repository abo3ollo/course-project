"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Course } from "@/src/types";
import { BookOpen, PlayCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
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
        <div className="mb-12 border-b border-graphite pb-8">
          <h1 className="font-serif text-4xl text-white">My Learning</h1>
          <p className="text-fog mt-2">Continue your learning journey and achieve your goals.</p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-24 bg-onyx rounded-[10px] border border-graphite">
            <BookOpen className="mx-auto h-12 w-12 text-[#2e3038] mb-4" />
            <h3 className="text-lg font-medium text-white">You don't have any courses yet</h3>
            <p className="text-fog mt-1 mb-6">Explore our catalog and start learning today.</p>
            <Link href="/courses">
              <Button className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-8">
                Browse Catalog
              </Button>
            </Link>
          </div>
        ) : (
          // ✅ ضبطنا الـ Grid عشان يبقى 1 في الموبايل، 2 في md، و 3 في lg و xl
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
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
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href={`/courses/${course._id}/learn`}>
                      <Button className="bg-white text-black hover:bg-gray-200 font-semibold rounded-full px-6">
                        <PlayCircle className="mr-2 h-5 w-5" /> Continue
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow">
                  <div className="flex items-center gap-2 text-xs font-semibold text-copper mb-3 tracking-wider uppercase">
                    <Tag size={12} />
                    <span>{course.category}</span>
                  </div>

                  <h2 className="text-xl font-serif text-white mb-4 line-clamp-2 leading-snug">
                    {course.title}
                  </h2>
                  
                  <div className="flex items-center gap-3 text-sm text-fog mt-auto">
                    {course.instructor?.avatar ? (
                      <img 
                        src={course.instructor.avatar} 
                        alt="Instructor"
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
                    <Link href={`/courses/${course._id}/learn`}>
                      <Button className="w-full bg-carbon text-white border border-[#2e3038] hover:bg-graphite hover:border-copper transition-colors rounded-full font-medium">
                        Continue Learning
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}