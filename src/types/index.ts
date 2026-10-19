export type Instructor = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
};

export type Course = {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
  level: string;
  instructor: Instructor;
  isPublished: boolean;
  createdAt: string;
};