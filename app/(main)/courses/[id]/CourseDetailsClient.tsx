"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Course, Review } from "@/src/types";
import { Clock, Globe, ShieldCheck, BookOpen, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/src/context/AuthContext";
import { useLanguage } from "@/src/context/LanguageContext";

export default function CourseDetailsClient({ courseId }: { courseId: string }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { language, t } = useLanguage();

  const [course, setCourse] = useState<Course | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`);
        setCourse(res.data.data.course);
        setIsAuthorized(res.data.data.isAuthorized);
        setEnrollmentStatus(res.data.data.enrollmentStatus);
      } catch (err) {
        console.error("Failed to fetch course", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/courses/${courseId}/reviews`);
        setReviews(res.data.data.reviews);
      } catch (err) {
        console.error(err);
      }
    };
    if (courseId) fetchReviews();
  }, [courseId]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await api.post(`/courses/${courseId}/reviews`, {
        rating: newRating,
        comment: newComment,
      });
      toast.success(t("Review submitted!"));
      setNewComment("");

      const res = await api.get(`/courses/${courseId}/reviews`);
      setReviews(res.data.data.reviews);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t("Failed to submit review"));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      toast.error(t("Please login first to enroll"));
      router.push("/login");
      return;
    }
    router.push(`/courses/${courseId}/checkout`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-copper"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-obsidian text-bone flex flex-col items-center justify-center">
        <h2 className="font-serif text-3xl text-white mb-4">{t("Course not found")}</h2>
        <Link href="/courses" className="text-copper hover:underline mt-2">
          {t("Back to Catalog")}
        </Link>
      </div>
    );
  }

  const isInstructor = user?._id === course?.instructor?._id;

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20 selection:bg-copper selection:text-white">
      {/* ── Hero Section ── */}
      <div className="bg-onyx border-b border-graphite py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Course Info (Left) */}
          <div className="lg:col-span-2 space-y-6 pt-4">
            <div className="flex items-center gap-3 text-sm font-medium text-copper uppercase tracking-wider">
              <span>{t(course.category)}</span>
              <span>•</span>
              <span>{t(course.level)}</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-lg text-fog leading-relaxed max-w-3xl">
              {course.description}
            </p>

            <div className="flex items-center gap-4 pt-6">
              {course.instructor?.avatar ? (
                <img src={course.instructor.avatar} className="w-12 h-12 rounded-full border border-graphite object-cover" alt={t("Instructor")} />
              ) : (
                <div className="w-12 h-12 rounded-full bg-carbon border border-graphite flex items-center justify-center font-serif text-xl text-copper">
                  {course.instructor?.firstName?.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm text-steel">{t("Created by")}</p>
                <p className="font-medium text-white">
                  {course.instructor?.firstName} {course.instructor?.lastName}
                </p>
              </div>
            </div>
          </div>

          {/* Enrollment Card (Right) */}
          <div className="lg:col-span-1">
            <div className="bg-onyx border border-graphite rounded-[10px] p-6 sticky top-24">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover rounded-md mb-6 border border-graphite"
              />

              <div className="font-serif text-4xl text-white mb-6">
                {course.price === 0 ? t("Free") : `$${course.price}`}
              </div>

              {/* Action Buttons */}
              {isInstructor ? (
                <div className="space-y-3 mb-6">
                  <Link href={`/courses/edit/${course._id}`}>
                    <Button className="w-full bg-white text-black hover:bg-gray-200 h-12 text-lg rounded-full font-medium">
                      {t("Edit Course")}
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-steel">
                    {t("You are the instructor of this course.")}
                  </p>
                </div>
              ) : isAuthorized ? (
                <div className="space-y-3 mb-6">
                  <Link href={`/courses/${course._id}/learn`}>
                    <Button className="w-full bg-copper hover:bg-copper/90 text-white h-12 text-lg rounded-full font-medium transition-colors">
                      {t("Continue Learning")}
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-steel">
                    {t("You are already enrolled in this course.")}
                  </p>
                </div>
              ) : enrollmentStatus === "pending" ? (
                <div className="space-y-3 mb-6">
                  <Button
                    disabled
                    className="w-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 h-12 text-lg rounded-full font-medium cursor-not-allowed opacity-100"
                  >
                    {t("Pending Admin Approval")}
                  </Button>
                  <p className="text-xs text-center text-steel">
                    {t("Your receipt is being reviewed. Please wait.")}
                  </p>
                </div>
              ) : (
                <>
                  <Button
                    onClick={handleEnrollClick}
                    className="w-full bg-white text-black hover:bg-gray-200 h-12 text-lg rounded-full font-medium mb-4 transition-colors"
                  >
                    {t("Enroll Now")}
                  </Button>
                  <p className="text-xs text-center text-steel mb-6">
                    {t("30-Day Money-Back Guarantee")}
                  </p>
                </>
              )}

              {/* Features List */}
              <div className="space-y-4 text-sm text-fog mt-8 pt-6 border-t border-graphite">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-copper" />
                  <span>{t("Full lifetime access")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-copper" />
                  <span>{t("Access on mobile and TV")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-copper" />
                  <span>{t("Certificate of completion")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Course Curriculum Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8 border-b border-graphite pb-4">
              <BookOpen className="text-copper" size={28} />
              <h2 className="font-serif text-3xl text-white">{t("Course Curriculum")}</h2>
            </div>

            {course.sections && course.sections.length > 0 ? (
              <div className="space-y-4">
                {course.sections.map((section, index) => {
                  // ✅ هنا السحر: لو هو مدرس الكورس أو أدمن، يقدر يشوف الفيديو
                  const canWatch = isAuthorized || isInstructor || user?.role === "ADMIN";

                  return (
                    <div key={index} className="border border-graphite rounded-[10px] bg-onyx overflow-hidden">
                      <div className="p-5 bg-carbon border-b border-graphite flex justify-between items-center">
                        <div>
                          <h3 className="font-serif text-xl text-white">
                            {t("Section {number}", { number: index + 1 })}: {section.title}
                          </h3>
                          <p className="text-sm text-fog mt-1">
                            • {section.duration || "0 min"}
                          </p>
                        </div>
                        {section.isFreePreview && (
                          <span className="text-xs font-semibold text-copper border border-copper/30 bg-copper/10 px-3 py-1 rounded-full uppercase tracking-wider">
                            {t("Free Preview")}
                          </span>
                        )}
                      </div>

                      {/* ✅ عرض الفيديو لو عنده صلاحية */}
                      {canWatch && section.videoId ? (
                        <div className="bg-black aspect-video relative">
                          <iframe
                            src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${section.videoId}`}
                            loading="lazy"
                            className="absolute top-0 left-0 w-full h-full"
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <div className="p-10 bg-onyx flex flex-col items-center justify-center text-steel border-t border-graphite/50">
                          <Lock size={32} className="mb-3" />
                          <p className="text-base font-medium">{t("Enroll to unlock this video")}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-onyx rounded-[10px] border border-graphite border-dashed">
                <p className="text-fog">{t("No curriculum added for this course yet.")}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {/* يمكن إضافة Requirements هنا لاحقاً */}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-serif text-3xl text-white">{t("Student Reviews")}</h2>
            <div className="flex items-center gap-2 bg-carbon border border-graphite px-4 py-1.5 rounded-full">
              <span className="text-copper font-bold text-lg">{course.ratingsAverage}</span>
              <span className="text-fog text-sm">({course.ratingsQuantity} {t("reviews")})</span>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-fog">{t("No reviews yet. Be the first to review!")}</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="bg-onyx border border-graphite p-6 rounded-[10px]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {review.user.avatar ? (
                        <img src={review.user.avatar} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-graphite text-copper flex items-center justify-center font-bold">
                          {review.user.firstName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{review.user.firstName} {review.user.lastName}</p>
                        <p className="text-xs text-fog">{new Date(review.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < review.rating ? "text-copper fill-copper" : "text-graphite"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-bone">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Review Form */}
        {isAuthorized && !isInstructor && (
          <div className="mt-8 bg-onyx border border-graphite p-6 rounded-[10px]">
            <h3 className="font-serif text-xl text-white mb-4">{t("Leave a Review")}</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-fog text-sm">{t("Your Rating:")}</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="focus:outline-none hover:scale-110 transition"
                  >
                    <Star
                      size={24}
                      className={star <= newRating ? "text-copper fill-copper" : "text-graphite"}
                    />
                  </button>
                ))}
              </div>
              <textarea
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("Share your experience with this course...")}
                className="w-full bg-carbon border border-graphite rounded-md p-3 text-white focus:outline-none focus:ring-1 focus:ring-copper min-h-25"
              />
              <Button
                type="submit"
                disabled={isSubmittingReview}
                className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-6"
              >
                {isSubmittingReview ? t("Submitting...") : t("Submit Review")}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}