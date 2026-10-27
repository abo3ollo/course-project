"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/axios";
import { UploadCloud, Copy } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [receipt, setReceipt] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receipt) {
      toast.error("Please upload the payment receipt");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("receipt", receipt);

    try {
      await api.post(`/courses/${courseId}/enroll`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Receipt uploaded! Please wait for admin approval.");
      router.push("/my-courses"); // أو صفحة بتقولك مستني الموافقة
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-onyx border border-graphite rounded-[10px] p-8">
        <h1 className="font-serif text-3xl text-white mb-2">Complete Payment</h1>
        <p className="text-fog mb-6">Please transfer the amount to the following account and upload the receipt.</p>

        <div className="bg-carbon border border-graphite p-4 rounded-lg mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-fog">Vodafone Cash:</span>
            <span className="text-white font-mono">01012345678</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-fog">InstaPay:</span>
            <span className="text-white font-mono">your@instapay</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="border-2 border-dashed border-graphite rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-carbon transition">
            <UploadCloud size={24} className="text-copper mb-2" />
            <span className="text-sm text-fog">{receipt ? receipt.name : "Upload Receipt Image"}</span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => setReceipt(e.target.files?.[0] || null)} />
          </label>

          <Button type="submit" disabled={isLoading} className="w-full bg-white text-black hover:bg-gray-200 rounded-full">
            {isLoading ? "Submitting..." : "Submit Receipt"}
          </Button>
        </form>
      </div>
    </div>
  );
}