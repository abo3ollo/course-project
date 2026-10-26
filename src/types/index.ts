export type Instructor = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
};

// ✅ عرفنا شكل الدرس
export type Lesson = {
  _id?: string;
  title: string;
  duration?: string;
  videoUrl?: string;
  isFree?: boolean;
};

// ✅ عرفنا شكل القسم
export type Section = {
  _id?: string;
  title: string;
  learningObjective?: string;
  introVideoTitle?: string;
  duration?: string;
  videoUrl?: string;
  isFreePreview?: boolean;
  isDraft?: boolean;
  lessons?: Lesson[];
};

export type Course = {
  _id: string;
  title: string;
  subtitle?: string;       // ضيفنا دي
  description: string;
  price: number;
  promotionalPrice?: number; // ضيفنا دي
  thumbnail: string;
  category: string;
  level: string;
  language?: string;       // ضيفنا دي
  promoVideo?: string;     // ضيفنا دي
  instructor: Instructor;
  isPublished: boolean;
  createdAt: string;
  sections?: Section[];    // ✅ ضيفنا الأقسام هنا
  ratingsAverage: number;
  ratingsQuantity: number;
};

export type Review = {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
};

