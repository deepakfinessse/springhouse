import mongoose from "mongoose";
import { applySlugify } from "@/utils/slugMiddleware";

const aboutUsSchema = new mongoose.Schema(
  {
    mainBanner: {
      type: String,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    heading: {
      type: String,
    },
    history: [
      {
        year: String,
        content: String,
      },
    ],

    whyUs: [
      {
        type: String,
      },
    ],
    whoAreWe: [
      {
        title: String,
        description: String,
        frontImg: String,
        backImg: String,
        isReverse: { type: Boolean, default: false },
      },
    ],
    seo: {
      metaTitle: String,
      metaDescription: String,
      codeSnippet: String,
    },
  },
  { timestamps: true },
);

applySlugify(aboutUsSchema, "heading");

export const AboutUs =
  mongoose.models.AboutUs || mongoose.model("AboutUs", aboutUsSchema);
