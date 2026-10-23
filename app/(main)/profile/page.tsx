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
    defaultValues: { firstName: "", lastName: "" },
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

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-copper"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans pb-20 selection:bg-copper selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* Header */}
        <div className="border-b border-graphite pb-8">
          <h1 className="font-serif text-4xl text-white">Account Settings</h1>
          <p className="text-fog mt-2 max-w-2xl">
            Manage your profile details, avatar credentials, and account security preferences.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-graphite">
          <nav className="flex gap-8">
            <button className="pb-4 border-b-2 border-copper text-copper font-medium">General Profile</button>
            <button className="pb-4 text-fog hover:text-white font-medium transition-colors">Security & Password</button>
            <button className="pb-4 text-fog hover:text-white font-medium transition-colors">Notifications</button>
            <button className="pb-4 text-fog hover:text-white font-medium transition-colors">Billing & Certificates</button>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left Column (Profile Info) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Avatar Card */}
            <div className="bg-onyx p-8 rounded-[10px] border border-graphite">
              <h2 className="font-serif text-2xl text-white mb-1">Profile Picture</h2>
              <p className="text-sm text-fog mb-6">This image will appear across your enrolled courses, certificates, and forum interactions.</p>

              <div className="flex items-center gap-6">
                <div className="relative">
                  {user?.avatar && !user.avatar.includes('default-avatar') ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-2 border-graphite"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  {/* Fallback */}
                  <div className={`w-24 h-24 rounded-full bg-carbon text-copper flex items-center justify-center font-serif text-3xl border-2 border-graphite ${user?.avatar && !user.avatar.includes('default-avatar') ? 'hidden' : ''}`}>
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-copper text-white p-2.5 rounded-full cursor-pointer hover:bg-copper/90 transition shadow-lg border border-obsidian">
                    <Camera size={18} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                  </label>
                </div>
                <div>
                  <div className="flex gap-3 mb-3">
                    <label className="cursor-pointer bg-white text-black px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-200 transition">
                      {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                    </label>
                    <Button variant="outline" className="rounded-full text-sm border-graphite text-fog hover:text-white hover:bg-carbon">Remove</Button>
                  </div>
                  <p className="text-xs text-steel">Recommended: JPG, GIF or PNG. Max size: 5MB.</p>
                </div>
              </div>
            </div>

            {/* Personal Info Card */}
            <div className="bg-onyx p-8 rounded-[10px] border border-graphite">
              <div className="flex justify-between items-start mb-6 border-b border-graphite pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-white mb-1">Personal Information</h2>
                  <p className="text-sm text-fog">Update your personal details and public learning identity.</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user?.isVerified ? 'bg-copper/10 text-copper border-copper/30' : 'bg-red-400/10 text-red-400 border-red-400/30'}`}>
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
                          <FieldLabel className="text-bone">First Name</FieldLabel>
                          <Input {...field} className="bg-carbon border-graphite text-white focus-visible:ring-copper" />
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
                          <FieldLabel className="text-bone">Last Name</FieldLabel>
                          <Input {...field} className="bg-carbon border-graphite text-white focus-visible:ring-copper" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </div>

                <FieldGroup>
                  <FieldLabel className="text-bone">Email Address</FieldLabel>
                  <Input value={user?.email || ""} disabled className="bg-carbon/50 border-graphite text-fog cursor-not-allowed" />
                </FieldGroup>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-graphite">
                  <Button type="button" variant="ghost" className="rounded-full text-fog hover:text-white">Cancel</Button>
                  <Button type="submit" disabled={isUpdatingProfile} className="bg-white text-black hover:bg-gray-200 rounded-full font-medium px-6">
                    {isUpdatingProfile ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column (Security) */}
          <div className="lg:col-span-1 space-y-8">

            {/* Change Password Card */}
            <div className="bg-onyx p-8 rounded-[10px] border border-graphite">
              <div className="flex items-start gap-4 mb-6 border-b border-graphite pb-4">
                <div className="bg-red-400/10 text-red-400 p-2.5 rounded-full border border-red-400/20">
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-white">Change Password</h2>
                  <p className="text-xs text-fog mt-1">Ensure your account is protected with a secure password.</p>
                </div>
              </div>

              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                <FieldGroup>
                  <Controller
                    name="currentPassword"
                    control={passwordForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-bone text-sm">Current Password</FieldLabel>
                        <Input type="password" {...field} className="bg-carbon border-graphite text-white focus-visible:ring-copper" />
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
                        <FieldLabel className="text-bone text-sm">New Password</FieldLabel>
                        <Input type="password" {...field} className="bg-carbon border-graphite text-white focus-visible:ring-copper" placeholder="At least 8 characters" />
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
                        <FieldLabel className="text-bone text-sm">Confirm New Password</FieldLabel>
                        <Input type="password" {...field} className="bg-carbon border-graphite text-white focus-visible:ring-copper" placeholder="Repeat new password" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <Button type="submit" disabled={isChangingPassword} className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-medium mt-4">
                  <Lock size={16} className="mr-2" />
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </div>

            {/* 2FA Card (Mockup) */}
            <div className="bg-carbon p-6 rounded-[10px] border border-graphite flex gap-4">
              <div className="bg-graphite text-copper p-2.5 rounded-full h-fit border border-slate">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-serif text-lg text-white mb-1">Two-Factor Authentication</h3>
                <p className="text-xs text-fog mb-3 leading-relaxed">Add an extra layer of protection to your account with authenticator apps.</p>
                <button className="text-sm text-copper font-medium hover:underline flex items-center gap-1">
                  Configure 2FA &rarr;
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}