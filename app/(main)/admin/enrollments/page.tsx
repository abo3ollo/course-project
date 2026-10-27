"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);

  const fetchPending = async () => {
    const res = await api.get("/courses/admin/pending-enrollments");
    setEnrollments(res.data.data.enrollments);
  };

  useEffect(() => { fetchPending(); }, []);

  const handleUpdate = async (id: string, status: string) => {
    try {
      await api.patch(`/courses/admin/enrollments/${id}`, { status });
      toast.success(`Enrollment ${status}`);
      fetchPending(); // تحديث الجدول
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-bone p-8">
      <h1 className="font-serif text-3xl text-white mb-6">Pending Enrollments</h1>
      <div className="bg-onyx border border-graphite rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-carbon border-b border-graphite text-fog">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Course</th>
              <th className="p-4">Receipt</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite">
            {enrollments.map((e) => (
              <tr key={e._id}>
                <td className="p-4 text-white">{e.user.firstName} {e.user.lastName}</td>
                <td className="p-4 text-fog">{e.course.title}</td>
                <td className="p-4">
                  <a href={e.receiptImage} target="_blank" className="text-copper underline">View Receipt</a>
                </td>
                <td className="p-4 flex gap-2">
                  <Button size="sm" onClick={() => handleUpdate(e._id, "approved")} className="bg-green-600 hover:bg-green-700">Approve</Button>
                  <Button size="sm" onClick={() => handleUpdate(e._id, "rejected")} className="bg-red-600 hover:bg-red-700">Reject</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}