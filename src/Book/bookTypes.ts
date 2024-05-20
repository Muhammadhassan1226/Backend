import { User } from "../user/userTypes";

export interface Book {
  _id: string;
  title: string;
  author: User;
  genre: string;
  coverImage: string;
  coverImageId: string;
  file: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
}
