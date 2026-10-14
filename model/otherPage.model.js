import mongoose from "mongoose";
import { applySlugify } from "@/utils/slugMiddleware";

const otherPageSchema = new mongoose.Schema(
  {
    name: {
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
    isActive: {
      type: Boolean,
      default: true,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      codeSnippet: String,
    },
  },
  { timestamps: true },
);

applySlugify(otherPageSchema, "name");

export const OtherPage =
  mongoose.models.OtherPage || mongoose.model("OtherPage", otherPageSchema);
