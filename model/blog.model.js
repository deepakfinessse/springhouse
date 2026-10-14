import mongoose from "mongoose";
import { applySlugify } from "@/utils/slugMiddleware";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      codeSnippet: String,
    },
  },
  { timestamps: true },
);

applySlugify(blogSchema, "title");

export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
