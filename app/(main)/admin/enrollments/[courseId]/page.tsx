"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, DollarSign, Clock, ArrowLeft } from "lucide-react";

export default function CourseEnrollmentsPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.courseId as string;
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEnrollments = async () => {
        try {
            const res = await api.get(`/courses/admin/courses/${courseId}/enrollments`);
            setEnrollments(res.data.data.enrollments);
        } catch (err) {
            toast.error("Failed to load enrollments");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) fetchEnrollments();
    }, [courseId]);

    const handleMarkAsPaid = async (enrollmentId: string) => {
        try {
            await api.patch(`/courses/admin/enrollments/${enrollmentId}/pay-instructor`);
            toast.success("Marked as paid successfully!");
            // تحديث الجدول
            setEnrollments((prev) =>
                prev.map((e) =>
                    e._id === enrollmentId ? { ...e, isPaidToInstructor: true, paidAt: new Date() } : e
                )
            );
        } catch (err) {
            toast.error("Failed to mark as paid");
        }
    };

    if (isLoading) return <div className="text-center py-20 text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-obsidian text-bone p-8">
            <div className="max-w-6xl mx-auto">
                
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-fog hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>
                <h1 className="font-serif text-3xl text-white mb-6">Course Enrollments</h1>

                <div className="bg-onyx border border-graphite rounded-[10px] overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-carbon border-b border-graphite text-fog">
                            <tr>
                                <th className="px-6 py-4 font-medium">Student</th>
                                <th className="px-6 py-4 font-medium">Amount Paid</th>
                                <th className="px-6 py-4 font-medium">Instructor Cut (85%)</th>
                                <th className="px-6 py-4 font-medium">Payment Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-graphite">
                            {enrollments.map((enrollment) => (
                                <tr key={enrollment._id} className="hover:bg-carbon/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {enrollment.user.avatar ? (
                                                <img src={enrollment.user.avatar} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-graphite text-copper flex items-center justify-center font-bold">
                                                    {enrollment.user.firstName.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-white font-medium">{enrollment.user.firstName} {enrollment.user.lastName}</p>
                                                <p className="text-xs text-fog">{enrollment.user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white">${enrollment.amountPaid}</td>
                                    <td className="px-6 py-4 text-copper font-bold">
                                        ${enrollment.instructorEarnings}
                                    </td>
                                    <td className="px-6 py-4">
                                        {enrollment.isPaidToInstructor ? (
                                            <span className="flex items-center gap-1 text-green-400">
                                                <CheckCircle2 size={14} /> Paid
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-yellow-500">
                                                <Clock size={14} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {enrollment.isPaidToInstructor ? (
                                            <span className="text-xs text-fog">Paid on {new Date(enrollment.paidAt).toLocaleDateString()}</span>
                                        ) : (
                                            <Button
                                                onClick={() => handleMarkAsPaid(enrollment._id)}
                                                className="bg-white text-black hover:bg-gray-200 rounded-full text-xs h-8 px-4"
                                            >
                                                <DollarSign size={14} className="mr-1" /> Mark as Paid
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}