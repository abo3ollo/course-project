"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useAuth } from "@/src/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  updateProfileSchema,
  UpdateProfileSchemaType,
  changePasswordSchema,
  ChangePasswordSchemaType,
} from "@/src/schema/profile.schema";
import { Camera, Lock, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, logout, refresh } = useAuth();
  const router = useRouter();

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // --- Profile Form ---
  const profileForm = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user, profileForm]);

  // --- Password Form ---
  const passwordForm = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
  });

  // --- Handlers ---
  async function onUpdateProfile(values: UpdateProfileSchemaType) {
    setIsUpdatingProfile(true);
    try {
      await api.patch("/users/me", values);
      toast.success("Profile updated successfully");
      await refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  async function onChangePassword(values: ChangePasswordSchemaType) {
    setIsChangingPassword(true);
    try {
      await api.patch("/users/me/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed. Please login again.");
      await logout();
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Change failed");
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploadingAvatar(true);
    try {
      await api.post("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Avatar updated");
      await refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  if (isAuthLoading) return <div className="text-center py-20">Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-2">Manage your profile details, avatar credentials, and account security preferences.</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            <button className="pb-4 border-b-2 border-indigo-600 text-indigo-600 font-medium">General Profile</button>
            <button className="pb-4 text-gray-500 hover:text-gray-900 font-medium">Security & Password</button>
            <button className="pb-4 text-gray-500 hover:text-gray-900 font-medium">Notifications</button>
            <button className="pb-4 text-gray-500 hover:text-gray-900 font-medium">Billing & Certificates</button>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column (Profile Info) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Avatar Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Profile Picture</h2>
              <p className="text-sm text-gray-500 mb-6">This image will appear across your enrolled courses, certificates, and forum interactions.</p>

              <div className="flex items-center gap-6">
                <div className="relative">
                  {user?.avatar && !user.avatar.includes('default-avatar') ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full object-cover"
                      onError={(e) => {
                        // لو الصورة اتكسرت، نخفيها ونظهر أول حرف
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  {/* Fallback (يظهر لو مفيش صورة أو لو الصورة اتكسرت) */}
                  <div className={`w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs ${user?.avatar && !user.avatar.includes('default-avatar') ? 'hidden' : ''}`}>
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition shadow-lg">
                    <Camera size={16} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                  </label>
                </div>
                <div>
                  <div className="flex gap-3 mb-2">
                    <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                      {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                    </label>
                    <Button variant="outline" className="rounded-lg text-sm">Remove</Button>
                  </div>
                  <p className="text-xs text-gray-500">Recommended: JPG, GIF or PNG. Max size: 5MB.</p>
                </div>
              </div>
            </div>

            {/* Personal Info Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Personal Information</h2>
                  <p className="text-sm text-gray-500">Update your personal details and public learning identity.</p>
                </div>
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                  {user?.isVerified ? "Verified Student" : "Unverified"}
                </span>
              </div>

              <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FieldGroup>
                    <Controller
                      name="firstName"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className="text-gray-700">First Name</FieldLabel>
                          <Input {...field} className="bg-gray-50 border-gray-200 focus:bg-white" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Controller
                      name="lastName"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className="text-gray-700">Last Name</FieldLabel>
                          <Input {...field} className="bg-gray-50 border-gray-200 focus:bg-white" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </div>

                <FieldGroup>
                  <FieldLabel className="text-gray-700">Email Address</FieldLabel>
                  <Input value={user?.email || ""} disabled className="bg-gray-100 border-gray-200 text-gray-500" />
                </FieldGroup>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button type="button" variant="ghost" className="rounded-lg">Cancel</Button>
                  <Button type="submit" disabled={isUpdatingProfile} className="bg-black text-white rounded-lg">
                    {isUpdatingProfile ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column (Security) */}
          <div className="lg:col-span-1 space-y-6">

            {/* Change Password Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start gap-3 mb-6">
                <div className="bg-red-50 text-red-500 p-2 rounded-full">
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                  <p className="text-xs text-gray-500 mt-1">Ensure your account is protected with a secure password.</p>
                </div>
              </div>

              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                <FieldGroup>
                  <Controller
                    name="currentPassword"
                    control={passwordForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-gray-700 text-sm">Current Password</FieldLabel>
                        <Input type="password" {...field} className="bg-gray-50 border-gray-200" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <FieldGroup>
                  <Controller
                    name="newPassword"
                    control={passwordForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-gray-700 text-sm">New Password</FieldLabel>
                        <Input type="password" {...field} className="bg-gray-50 border-gray-200" placeholder="At least 8 characters" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <FieldGroup>
                  <Controller
                    name="confirmPassword"
                    control={passwordForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-gray-700 text-sm">Confirm New Password</FieldLabel>
                        <Input type="password" {...field} className="bg-gray-50 border-gray-200" placeholder="Repeat new password" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <Button type="submit" disabled={isChangingPassword} className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-lg mt-2">
                  <Lock size={16} className="mr-2" />
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </div>

            {/* 2FA Card (Mockup) */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex gap-4">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full h-fit">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-gray-500 mt-1 mb-2">Add an extra layer of protection to your account with authenticator apps.</p>
                <button className="text-sm text-indigo-600 font-medium hover:underline">Configure 2FA &rarr;</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}