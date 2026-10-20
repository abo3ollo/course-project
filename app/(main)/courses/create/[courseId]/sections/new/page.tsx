"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Video, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function AddSectionPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    learningObjective: "",
    introVideoTitle: "",
    duration: "",
    isFreePreview: false,
    isDraft: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Section title is required");
      return;
    }

    setIsLoading(true);
    try {
      await api.post(`/courses/${courseId}/sections`, {
        ...formData,
        lessons: []
      });

      toast.success("Section added successfully!");
      router.push(`/courses/manage/${courseId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add section");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <p className="text-xs font-bold text-indigo-600 bg-indigo-50 w-fit px-2 py-1 rounded mb-1">
            CURRICULUM BUILDER • SECTION
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Add New Section</h1>
          <p className="text-gray-500 mt-1">Create a curriculum chapter to organize lectures, videos, and quizzes.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
        
        {/* Section Title */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Section Title <span className="text-red-500">*</span></Label>
          <Input 
            placeholder="e.g., Advanced State Management with Redux Toolkit" 
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="h-12 text-lg"
          />
        </div>

        {/* Learning Objective */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm font-semibold">Learning Objective</Label>
            <span className="text-xs text-gray-400">Optional</span>
          </div>
          <Textarea 
            placeholder="What key outcomes or skills will students achieve in this section?"
            value={formData.learningObjective}
            onChange={(e) => setFormData({ ...formData, learningObjective: e.target.value })}
            className="min-h-25"
          />
        </div>

        {/* Video Section */}
        <div className="border rounded-xl p-6 bg-gray-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h4 className="font-bold text-gray-900">Section Overview Video / Intro Lecture Video</h4>
              <p className="text-sm text-gray-500 mt-1">Attach an introductory clip or first lecture for this chapter.</p>
            </div>
            <div className="flex bg-gray-200 p-1 rounded-md shrink-0">
              <button type="button" className="px-4 py-1.5 text-xs font-medium bg-white shadow-sm rounded">Upload File</button>
              <button type="button" className="px-4 py-1.5 text-xs font-medium text-gray-500">Embed URL</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-600">Lecture / Video Title</Label>
              <Input 
                placeholder="e.g., Section 2 Intro & Overview"
                value={formData.introVideoTitle}
                onChange={(e) => setFormData({ ...formData, introVideoTitle: e.target.value })}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-600">Estimated Duration</Label>
              <Input 
                placeholder="e.g., 12:45 min"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="bg-white"
              />
            </div>
          </div>

          <div className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition">
            <div className="bg-indigo-50 p-4 rounded-full mb-4">
              <Video className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-base font-semibold text-indigo-600">Click to upload video file or drag and drop</p>
            <p className="text-sm text-gray-500 mt-2">MP4, MOV, or WebM up to 2GB (1080p / 4K recommended)</p>
          </div>
        </div>

        {/* Access & Visibility */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-500 tracking-wider">ACCESS & VISIBILITY</h4>
          
          <label className="flex items-start gap-4 p-5 border rounded-xl cursor-pointer hover:bg-gray-50">
            <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300" 
              checked={formData.isFreePreview} onChange={(e) => setFormData({...formData, isFreePreview: e.target.checked})} />
            <div>
              <p className="text-base font-medium text-gray-900">Free Preview Section</p>
              <p className="text-sm text-gray-500 mt-1">Allow prospective students to watch videos in this section without purchasing the course.</p>
            </div>
          </label>
          
          <label className="flex items-start gap-4 p-5 border rounded-xl cursor-pointer hover:bg-gray-50 bg-indigo-50/30 border-indigo-100">
            <input type="checkbox" className="mt-1 w-5 h-5 rounded border-indigo-300 text-indigo-600" 
              checked={formData.isDraft} onChange={(e) => setFormData({...formData, isDraft: e.target.checked})} />
            <div>
              <p className="text-base font-medium text-indigo-900">Keep as Draft</p>
              <p className="text-sm text-indigo-600/70 mt-1">Hide this section from enrolled students until you finish adding all lessons and quizzes.</p>
            </div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 px-8">
            {isLoading ? "Adding..." : "Add Section"}
          </Button>
        </div>
      </form>
    </div>
  );
}