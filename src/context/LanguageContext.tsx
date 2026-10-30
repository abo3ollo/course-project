"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

type Language = "en" | "ar";
let inMemoryLanguage: Language = "en";

const translations: Record<Language, Record<string, string>> = {
  en: {},
  ar: {
    "EBDA3": "ابداع",
    "Admin Dashboard": "لوحة تحكم المسؤول",
    "My Courses": "دوراتي",
    "My Revenue": "إيراداتي",
    Enrollments: "التسجيلات",
    Logout: "تسجيل الخروج",
    Login: "تسجيل الدخول",
    "Sign Up": "إنشاء حساب",
    "Logged out successfully": "تم تسجيل الخروج بنجاح",
    Notifications: "الإشعارات",
    "Mark all as read": "تحديد الكل كمقروء",
    "No notifications yet.": "لا توجد إشعارات حتى الآن.",
    "Master Your Craft.": "أتقن مهاراتك.",
    "Join an exclusive platform to learn from industry experts and elevate your skills.":
      "انضم إلى منصة مميزة للتعلم من خبراء المجال وتطوير مهاراتك.",
    "Get Started": "ابدأ الآن",
    "Sign In": "دخول",
    "Admin Control Panel": "لوحة تحكم المسؤول",
    "Welcome, {name}.": "مرحبًا، {name}.",
    "Manage the entire platform": "إدارة المنصة بالكامل",
    "Total Users": "إجمالي المستخدمين",
    "Total Courses": "إجمالي الدورات",
    "Platform Revenue": "إيرادات المنصة",
    Management: "الإدارة",
    "Manage users, courses, and approve pending payments.":
      "إدارة المستخدمين والدورات والموافقة على المدفوعات المعلقة.",
    "Go to Admin Dashboard": "الانتقال إلى لوحة تحكم المسؤول",
    "Pending Enrollments": "التسجيلات المعلقة",
    "Instructors Financials": "المستحقات المالية للمدربين",
    "Instructor Dashboard": "لوحة تحكم المدرب",
    "Welcome back, {name}.": "مرحبًا بعودتك، {name}.",
    "Manage your courses and students": "إدارة دوراتك وطلابك",
    "Enrolled Students": "الطلاب المسجلون",
    "Average Rating": "متوسط التقييم",
    "Your Top Courses": "أفضل دوراتك",
    "Manage your existing courses or create a new one.":
      "أدر دوراتك الحالية أو أنشئ دورة جديدة.",
    "+ Create New Course": "+ إنشاء دورة جديدة",
    "Quick Actions": "إجراءات سريعة",
    "Create Course": "إنشاء دورة",
    "Profile Settings": "إعدادات الملف الشخصي",
    "Student Dashboard": "لوحة تحكم الطالب",
    "Last login: Just now": "آخر تسجيل دخول: الآن",
    "Enrolled Courses": "الدورات المسجل بها",
    "Completed Courses": "الدورات المكتملة",
    Certificates: "الشهادات",
    "Continue Learning": "متابعة التعلم",
    "View All": "عرض الكل",
    "You haven't started any course yet.": "لم تبدأ أي دورة بعد.",
    "My Learning": "تعلمي",
    "Logged In Successfully": "تم تسجيل الدخول بنجاح",
    "Something went wrong.": "حدث خطأ ما.",
    "Please verify your email first": "يرجى تأكيد بريدك الإلكتروني أولًا",
    "Verification email sent! Check your inbox.": "تم إرسال رسالة التأكيد! تحقق من بريدك الوارد.",
    "Failed to resend. Try again later.": "تعذرت إعادة الإرسال. حاول مرة أخرى لاحقًا.",
    "Resend Verification Email": "إعادة إرسال رسالة التأكيد",
    "Logging in...": "جارٍ تسجيل الدخول...",
    "Log In": "تسجيل الدخول",
    "Log in": "تسجيل الدخول",
    "Welcome back. Enter your details to continue.": "مرحبًا بعودتك. أدخل بياناتك للمتابعة.",
    Email: "البريد الإلكتروني",
    Password: "كلمة المرور",
    "Forgot password?": "هل نسيت كلمة المرور؟",
    "Your email is not verified. Check your inbox for the verification link.":
      "لم يتم تأكيد بريدك الإلكتروني. تحقق من صندوق الوارد للعثور على رابط التأكيد.",
    "Don't have an account?": "ليس لديك حساب؟",
    "Create Account": "إنشاء حساب",
    "Join the platform to start learning.": "انضم إلى المنصة وابدأ التعلم.",
    "First Name": "الاسم الأول",
    "Last Name": "اسم العائلة",
    "Must be at least 8 characters and contain a number.":
      "يجب ألا تقل كلمة المرور عن 8 أحرف وأن تحتوي على رقم.",
    "I am a": "أنا",
    Student: "طالب",
    Instructor: "مدرب",
    "Creating account...": "جارٍ إنشاء الحساب...",
    "Already have an account?": "لديك حساب بالفعل؟",
    "Sign in": "تسجيل الدخول",
    "Forgot Password": "نسيت كلمة المرور",
    "Enter your email and we'll send you a reset link.": "أدخل بريدك الإلكتروني وسنرسل إليك رابط إعادة تعيين كلمة المرور.",
    "Check Your Email": "تحقق من بريدك الإلكتروني",
    "If that email exists, we sent a password reset link.": "إذا كان هذا البريد مسجلًا، فقد أرسلنا رابط إعادة تعيين كلمة المرور.",
    "Check your inbox (and spam folder).": "تحقق من صندوق الوارد (ومجلد الرسائل غير المرغوب فيها).",
    "Back to Login": "العودة إلى تسجيل الدخول",
    "Sending...": "جارٍ الإرسال...",
    "Send Reset Link": "إرسال رابط إعادة التعيين",
    "Remember your password?": "هل تتذكر كلمة المرور؟",
    "Reset Password": "إعادة تعيين كلمة المرور",
    "Enter a new password for your account.": "أدخل كلمة مرور جديدة لحسابك.",
    "New Password": "كلمة المرور الجديدة",
    "Confirm New Password": "تأكيد كلمة المرور الجديدة",
    "Resetting...": "جارٍ إعادة التعيين...",
    "Invalid reset link.": "رابط إعادة التعيين غير صالح.",
    "Password reset successfully! Please log in.": "تمت إعادة تعيين كلمة المرور بنجاح! يرجى تسجيل الدخول.",
    "Invalid or expired token.": "الرمز غير صالح أو منتهي الصلاحية.",
    "Browse Catalog": "تصفح الدورات",
    "Discover new skills and expand your knowledge with our top-rated courses.":
      "اكتشف مهارات جديدة ووسّع معرفتك من خلال دوراتنا الأعلى تقييمًا.",
    "+ Create Course": "+ إنشاء دورة",
    "Search for courses...": "ابحث عن الدورات...",
    "All Categories": "جميع الفئات",
    Programming: "البرمجة",
    Design: "التصميم",
    Business: "الأعمال",
    "All Levels": "جميع المستويات",
    Beginner: "مبتدئ",
    Intermediate: "متوسط",
    Advanced: "متقدم",
    Newest: "الأحدث",
    "Price: Low to High": "السعر: من الأقل إلى الأعلى",
    "Price: High to Low": "السعر: من الأعلى إلى الأقل",
    "Highest Rated": "الأعلى تقييمًا",
    "No courses found": "لم يتم العثور على دورات",
    "Try adjusting your search or filters.": "جرّب تعديل البحث أو عوامل التصفية.",
    "Track your enrollments and continue your learning journey.":
      "تابع تسجيلاتك وأكمل رحلتك التعليمية.",
    "You don't have any courses yet": "ليس لديك أي دورات بعد",
    "Explore our catalog and start learning today.": "استكشف الدورات وابدأ التعلم اليوم.",
    Enrolled: "مسجل",
    "Pending ⏳": "قيد الانتظار ⏳",
    "Rejected ❌": "مرفوض ❌",
    sections: "أقسام",
    "Completed": "مكتمل",
    "Pending Approval": "بانتظار الموافقة",
    "Upload New Receipt": "رفع إيصال جديد",
    "Account Settings": "إعدادات الحساب",
    "Manage your profile details, avatar credentials, and account security preferences.":
      "أدر تفاصيل ملفك الشخصي وصورتك وإعدادات أمان حسابك.",
    "General Profile": "الملف الشخصي العام",
    "Security & Password": "الأمان وكلمة المرور",
    "Billing & Certificates": "الفوترة والشهادات",
    "Profile Picture": "الصورة الشخصية",
    "This image will appear across your enrolled courses, certificates, and forum interactions.":
      "ستظهر هذه الصورة في دوراتك وشهاداتك وتفاعلاتك في المنتدى.",
    "Uploading...": "جارٍ الرفع...",
    "Change Avatar": "تغيير الصورة",
    Remove: "إزالة",
    "Recommended: JPG, GIF or PNG. Max size: 5MB.": "الصيغ الموصى بها: JPG أو GIF أو PNG. الحد الأقصى: 5 ميجابايت.",
    "Personal Information": "المعلومات الشخصية",
    "Update your personal details and public learning identity.":
      "حدّث بياناتك الشخصية وهويتك التعليمية العامة.",
    "Loading...": "جارٍ التحميل...",
    "Net Revenue (85%)": "صافي الإيرادات (85%)",
    "Platform Fee (15%)": "رسوم المنصة (15%)",
    "Total Students": "إجمالي الطلاب",
    "Complete Payment": "إتمام الدفع",
    "Please transfer the amount to the following account and upload the receipt.":
      "يرجى تحويل المبلغ إلى الحساب التالي ثم رفع الإيصال.",
    "Vodafone Cash:": "فودافون كاش:",
    "Upload Receipt Image": "رفع صورة الإيصال",
    "Submitting...": "جارٍ الإرسال...",
    "Submit Receipt": "إرسال الإيصال",
    Students: "الطلاب",
    "Course Thumbnail": "صورة الدورة",
    "Failed to add section": "تعذر إضافة القسم",
    "Learning Objective": "هدف التعلم",
    "What key outcomes or skills will students achieve in this section?":
      "ما النتائج أو المهارات الأساسية التي سيكتسبها الطلاب في هذا القسم؟",
    "Please upload the payment receipt": "يرجى رفع إيصال الدفع",
    "Receipt uploaded! Please wait for admin approval.": "تم رفع الإيصال! يرجى انتظار موافقة المسؤول.",
    "Failed to submit": "تعذر الإرسال",
    "Free": "مجاني",
    "Course not found": "لم يتم العثور على الدورة",
    "Back to Catalog": "العودة إلى الدورات",
    "Created by": "إنشاء",
    "Edit Course": "تعديل الدورة",
    "You are the instructor of this course.": "أنت مدرب هذه الدورة.",
    "You are already enrolled in this course.": "أنت مسجل بالفعل في هذه الدورة.",
    "Pending Admin Approval": "بانتظار موافقة المسؤول",
    "Your receipt is being reviewed. Please wait.": "تتم مراجعة إيصالك. يرجى الانتظار.",
    "Enroll Now": "سجل الآن",
    "30-Day Money-Back Guarantee": "ضمان استرداد الأموال لمدة 30 يومًا",
    "Please login first to enroll": "يرجى تسجيل الدخول أولًا للتسجيل",
    "Review submitted!": "تم إرسال التقييم!",
    "Submit Review": "إرسال التقييم",
    "Switch to Arabic": "التبديل إلى العربية",
    "Switch to English": "التبديل إلى الإنجليزية",
    "Notification sender": "مرسل الإشعار",
    "Course thumbnail": "صورة الدورة",
    ADMIN: "مسؤول",
    USER: "طالب",
    "Section {number}": "القسم {number}",
    "Title is too short": "العنوان قصير جدًا",
    "Description is too short": "الوصف قصير جدًا",
    "Category is required": "الفئة مطلوبة",
    "Price is required": "السعر مطلوب",
    "Language is required": "اللغة مطلوبة",
    "Email is required": "البريد الإلكتروني مطلوب",
    "Please enter a valid email": "يرجى إدخال بريد إلكتروني صالح",
    "Please enter  your email": "يرجى إدخال بريدك الإلكتروني",
    "Password must be at least 8 characters": "يجب ألا تقل كلمة المرور عن 8 أحرف",
    "Password must contain at least one number": "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل",
    "Passwords don't match": "كلمتا المرور غير متطابقتين",
    "First name must be at least 2 characters": "يجب ألا يقل الاسم الأول عن حرفين",
    "First name must be at most 20 characters": "يجب ألا يزيد الاسم الأول عن 20 حرفًا",
    "Last name must be at least 2 characters": "يجب ألا يقل اسم العائلة عن حرفين",
    "Last name must be at most 20 characters": "يجب ألا يزيد اسم العائلة عن 20 حرفًا",
    "Failed to submit review": "تعذر إرسال التقييم",
    "Share your experience with this course...": "شارك تجربتك مع هذه الدورة...",
    "Welcome to the platform": "مرحبًا بك في المنصة",
    "Account created! Check your email to verify.": "تم إنشاء الحساب! تحقق من بريدك لتأكيده.",
    "Something went wrong. Try again.": "حدث خطأ ما. حاول مرة أخرى.",
    "Profile updated successfully": "تم تحديث الملف الشخصي بنجاح",
    "Update failed": "تعذر التحديث",
    "Password changed. Please login again.": "تم تغيير كلمة المرور. يرجى تسجيل الدخول مجددًا.",
    "Change failed": "تعذر التغيير",
    "Avatar updated": "تم تحديث الصورة",
    "Upload failed": "تعذر الرفع",
    "Failed to load dashboard data": "تعذر تحميل بيانات لوحة التحكم",
    "Email Address": "البريد الإلكتروني",
    "Verified Student": "طالب موثق",
    Unverified: "غير موثق",
    Cancel: "إلغاء",
    "Updating...": "جارٍ التحديث...",
    "Update Profile": "تحديث الملف الشخصي",
    "Change Password": "تغيير كلمة المرور",
    "Ensure your account is protected with a secure password.":
      "تأكد من حماية حسابك بكلمة مرور آمنة.",
    "Current Password": "كلمة المرور الحالية",
    "At least 8 characters": "8 أحرف على الأقل",
    "Repeat new password": "أعد كتابة كلمة المرور الجديدة",
    "Changing...": "جارٍ التغيير...",
    "Two-Factor Authentication": "المصادقة الثنائية",
    "Add an extra layer of protection to your account with authenticator apps.":
      "أضف طبقة حماية إضافية إلى حسابك باستخدام تطبيقات المصادقة.",
    "Configure 2FA →": "إعداد المصادقة الثنائية ←",
    "Verify Your Email": "أكد بريدك الإلكتروني",
    "We sent a verification link to": "أرسلنا رابط التأكيد إلى",
    "your email": "بريدك الإلكتروني",
    "Click the link in the email to activate your account.":
      "اضغط على الرابط في الرسالة لتفعيل حسابك.",
    "Email sent! Check your inbox.": "تم إرسال الرسالة! تحقق من بريدك الوارد.",
    "Resend Email": "إعادة إرسال الرسالة",
    "Already verified?": "هل أكدت بريدك بالفعل؟",
    "Email is missing": "البريد الإلكتروني غير موجود",
    "Verification email sent!": "تم إرسال رسالة التأكيد!",
    "Failed to send": "تعذر الإرسال",
    "Verifying Email": "جارٍ تأكيد البريد الإلكتروني",
    "Please wait while we verify your account...": "يرجى الانتظار ريثما نتحقق من حسابك...",
    "Email Verified!": "تم تأكيد البريد الإلكتروني!",
    "Verification Failed": "فشل تأكيد البريد الإلكتروني",
    "Go to Login": "الانتقال إلى تسجيل الدخول",
    "Register Again": "التسجيل مجددًا",
    "Go Home": "العودة إلى الرئيسية",
    "Verification token is missing.": "رمز التأكيد غير موجود.",
    "Email verified successfully!": "تم تأكيد البريد الإلكتروني بنجاح!",
    "Verification failed. The link may be invalid or expired.":
      "تعذر تأكيد البريد. قد يكون الرابط غير صالح أو منتهي الصلاحية.",
    "Page Not Found": "الصفحة غير موجودة",
    "The page you are looking for doesn't exist or has been moved. Let's get you back on track.":
      "الصفحة التي تبحث عنها غير موجودة أو تم نقلها. لنعد بك إلى المسار الصحيح.",
    "Back to Home": "العودة إلى الرئيسية",
    "Browse Courses": "تصفح الدورات",
    "Failed to fetch dashboard data": "تعذر تحميل بيانات لوحة التحكم",
    "Course Content": "محتوى الدورة",
    "Securing video stream...": "جارٍ تأمين بث الفيديو...",
    "Failed to load video. Please try again later.": "تعذر تحميل الفيديو. حاول مرة أخرى لاحقًا.",
    "Select a video to start learning.": "اختر فيديو لبدء التعلم.",
    Duration: "المدة",
    "Course not found or Unauthorized.": "الدورة غير موجودة أو ليس لديك صلاحية الوصول.",
    "Full lifetime access": "وصول مدى الحياة",
    "Access on mobile and TV": "الوصول عبر الهاتف والتلفاز",
    "Certificate of completion": "شهادة إتمام",
    "Course Curriculum": "محتوى الدورة",
    "Enroll to unlock this video": "سجل لفتح هذا الفيديو",
    "No curriculum added for this course yet.": "لم تتم إضافة محتوى لهذه الدورة بعد.",
    "Student Reviews": "تقييمات الطلاب",
    "No reviews yet. Be the first to review!": "لا توجد تقييمات بعد. كن أول من يقيّم!",
    "Leave a Review": "اكتب تقييمًا",
    "Your Rating:": "تقييمك:",
    "InstaPay:": "إنستا باي:",
    "Create New Course": "إنشاء دورة جديدة",
    "Fill in the basic details to publish your new course.": "أدخل التفاصيل الأساسية لنشر دورتك الجديدة.",
    "Basic Information": "المعلومات الأساسية",
    "Course Title": "عنوان الدورة",
    "Course Description": "وصف الدورة",
    Category: "الفئة",
    Level: "المستوى",
    Price: "السعر",
    Language: "اللغة",
    Thumbnail: "الصورة المصغرة",
    "Save Course": "حفظ الدورة",
    "Course created successfully": "تم إنشاء الدورة بنجاح",
    "Failed to create course": "تعذر إنشاء الدورة",
    "Save Changes": "حفظ التغييرات",
    "Course updated successfully": "تم تحديث الدورة بنجاح",
    "Failed to update course": "تعذر تحديث الدورة",
    "Add Section": "إضافة قسم",
    "Create Section": "إنشاء قسم",
    "Section Title": "عنوان القسم",
    "Section Description": "وصف القسم",
    "Add Video": "إضافة فيديو",
    "Video Title": "عنوان الفيديو",
    "Video URL": "رابط الفيديو",
    "Create Section & Continue": "إنشاء القسم والمتابعة",
    "Section created successfully": "تم إنشاء القسم بنجاح",
    "Failed to create section": "تعذر إنشاء القسم",
    Avatar: "الصورة الشخصية",
    Users: "المستخدمون",
    Courses: "الدورات",
    Name: "الاسم",
    Role: "الدور",
    Actions: "الإجراءات",
    Status: "الحالة",
    Published: "منشور",
    Draft: "مسودة",
    "Manage platform users and courses.": "إدارة مستخدمي المنصة ودوراتها.",
    "Are you sure you want to delete this user?": "هل أنت متأكد من رغبتك في حذف هذا المستخدم؟",
    "Are you sure you want to delete this course?": "هل أنت متأكد من رغبتك في حذف هذه الدورة؟",
    "User deleted": "تم حذف المستخدم",
    "Failed to delete user": "تعذر حذف المستخدم",
    "Course deleted": "تم حذف الدورة",
    "Failed to delete course": "تعذر حذف الدورة",
    "Enrollment {status}": "تم تحديث التسجيل: {status}",
    approved: "تمت الموافقة",
    rejected: "مرفوض",
    "Failed to update": "تعذر التحديث",
    Course: "الدورة",
    Receipt: "الإيصال",
    "View Receipt": "عرض الإيصال",
    Approve: "موافقة",
    Reject: "رفض",
    "Overview of all instructors revenue and platform fees.":
      "نظرة عامة على إيرادات جميع المدربين ورسوم المنصة.",
    "Total Platform Revenue": "إجمالي إيرادات المنصة",
    "Total Sales": "إجمالي المبيعات",
    "Platform Cut (15%)": "حصة المنصة (15%)",
    "Instructor Cut (85%)": "حصة المدرب (85%)",
    "No instructors found.": "لم يتم العثور على مدربين.",
    Creating: "جارٍ الإنشاء...",
    "Create & Continue": "إنشاء ومتابعة",
    "Step 1 of 3": "الخطوة 1 من 3",
    "Short Subtitle / Tagline": "عنوان فرعي مختصر",
    "What will students learn?": "ماذا سيتعلم الطلاب؟",
    "Select Category": "اختر الفئة",
    "Course Level": "مستوى الدورة",
    "Course Media & Assets": "وسائط الدورة وملفاتها",
    "Step 2 of 3": "الخطوة 2 من 3",
    "Click to upload image": "اضغط لرفع صورة",
    "Promotional Video (Optional)": "فيديو ترويجي (اختياري)",
    "Video Preview Placeholder": "معاينة الفيديو",
    "Pricing & Enrollment": "السعر والتسجيل",
    "Step 3 of 3": "الخطوة 3 من 3",
    "Price ($)": "السعر ($)",
    "Promotional Price ($)": "السعر الترويجي ($)",
    "Please upload a course thumbnail": "يرجى رفع صورة للدورة",
    "Course created! Let's add sections.": "تم إنشاء الدورة! لنضف الأقسام.",
    "Add New Section": "إضافة قسم جديد",
    "Curriculum Builder • Section": "منشئ المنهج • القسم",
    "Create a curriculum chapter to organize lectures, videos, and quizzes.":
      "أنشئ فصلًا في المنهج لتنظيم المحاضرات والفيديوهات والاختبارات.",
    Optional: "اختياري",
    "Section Overview Video": "فيديو تعريفي بالقسم",
    "Attach an introductory clip or first lecture for this chapter.":
      "أضف مقطعًا تمهيديًا أو المحاضرة الأولى لهذا الفصل.",
    "Lecture / Video Title": "عنوان المحاضرة / الفيديو",
    "Estimated Duration": "المدة المتوقعة",
    "Section title is required": "عنوان القسم مطلوب",
    "Please wait for the video to finish uploading": "يرجى انتظار اكتمال رفع الفيديو",
    "Section added successfully!": "تمت إضافة القسم بنجاح!",
    "Failed to upload video to Bunny": "تعذر رفع الفيديو",
    "Video uploaded successfully!": "تم رفع الفيديو بنجاح!",
    "Failed to get upload signature": "تعذر الحصول على رمز الرفع",
    "Build your curriculum by adding sections and lessons.":
      "أنشئ منهجك بإضافة الأقسام والدروس.",
    "Finish & View Course": "إنهاء وعرض الدورة",
    "Video attached": "تم إرفاق الفيديو",
    "No video": "لا يوجد فيديو",
    Edit: "تعديل",
    "No sections added yet. Start building your course!":
      "لم تتم إضافة أقسام بعد. ابدأ بإنشاء دورتك!",
    "Are you sure you want to delete this section?": "هل أنت متأكد من رغبتك في حذف هذا القسم؟",
    "Section deleted successfully": "تم حذف القسم بنجاح",
    "Failed to delete section": "تعذر حذف القسم",
    "Course not found.": "لم يتم العثور على الدورة.",
    "Update your course details and media.": "حدّث تفاصيل الدورة ووسائطها.",
    "Current Thumbnail": "الصورة الحالية",
    "Upload New (Optional)": "رفع صورة جديدة (اختياري)",
    "Click to change image": "اضغط لتغيير الصورة",
    "Course updated successfully!": "تم تحديث الدورة بنجاح!",
    reviews: "تقييمات",
    "Free Preview": "معاينة مجانية",
    "Your browser does not support the video tag.": "متصفحك لا يدعم تشغيل الفيديو.",
    "Failed to load secure video": "تعذر تحميل الفيديو الآمن",
    "Marked as completed!": "تم التحديد كمكتمل!",
    "Failed to mark as completed": "تعذر التحديد كمكتمل",
    "No video available.": "لا يوجد فيديو متاح.",
    "Mark as Complete": "تحديد كمكتمل",
    Arabic: "العربية",
    English: "الإنجليزية",
    "e.g., Complete React Masterclass": "مثال: دورة React متكاملة",
    "e.g., Master React 18, Redux...": "مثال: إتقان React 18 وRedux...",
    "e.g., Advanced State Management with Redux Toolkit":
      "مثال: إدارة الحالة المتقدمة باستخدام Redux Toolkit",
    "e.g., Section 2 Intro & Overview": "مثال: مقدمة القسم الثاني ونظرة عامة",
    "e.g., 12:45 min": "مثال: 12:45 دقيقة",
    "Upload directly to Bunny Stream (No size limit)": "ارفع مباشرة إلى Bunny Stream (دون حد للحجم)",
    "You can now submit the section.": "يمكنك الآن إرسال القسم.",
    "Access & Visibility": "الوصول والظهور",
    "Free Preview Section": "قسم للمعاينة المجانية",
    "Allow prospective students to watch videos in this section without purchasing the course.":
      "اسمح للطلاب المحتملين بمشاهدة فيديوهات هذا القسم دون شراء الدورة.",
    "Keep as Draft": "الاحتفاظ كمسودة",
    "Hide this section from enrolled students until you finish adding all lessons.":
      "أخفِ هذا القسم عن الطلاب المسجلين حتى تنتهي من إضافة جميع الدروس.",
    "Adding...": "جارٍ الإضافة...",
    "Failed to load section": "تعذر تحميل القسم",
    "Section updated successfully!": "تم تحديث القسم بنجاح!",
    "Failed to update section": "تعذر تحديث القسم",
    "Edit Section": "تعديل القسم",
    "Update the section details or upload a new video.":
      "حدّث تفاصيل القسم أو ارفع فيديو جديدًا.",
    "Current Video": "الفيديو الحالي",
    "Update Video (Optional)": "تحديث الفيديو (اختياري)",
    "Click to upload new video (Max 100MB)": "اضغط لرفع فيديو جديد (بحد أقصى 100 ميجابايت)",
    "Saving...": "جارٍ الحفظ...",
    "Manage: {title}": "إدارة: {title}",
    "Failed to load course": "تعذر تحميل الدورة",
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function subscribeToLanguageChanges(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("language-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("language-change", onChange);
  };
}

function getLanguageSnapshot(): Language {
  try {
    const savedLanguage = window.localStorage.getItem("language");
    inMemoryLanguage = savedLanguage === "ar" ? "ar" : "en";
    return inMemoryLanguage;
  } catch (error) {
    console.error("Failed to read saved language preference", error);
    return inMemoryLanguage;
  }
}

function getServerLanguageSnapshot(): Language {
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguageChanges,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  const setLanguage = useCallback((nextLanguage: Language) => {
    inMemoryLanguage = nextLanguage;
    try {
      window.localStorage.setItem("language", nextLanguage);
    } catch (error) {
      console.error("Failed to save language preference", error);
    }
    window.dispatchEvent(new Event("language-change"));
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const toggleLanguage = useCallback(
    () => setLanguage(language === "en" ? "ar" : "en"),
    [language, setLanguage],
  );
  const t = useCallback(
    (key: string, values?: Record<string, string | number>) => {
      const translatedText = translations[language][key] ?? key;
      return Object.entries(values ?? {}).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
        translatedText,
      );
    },
    [language],
  );
  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, setLanguage, toggleLanguage, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
