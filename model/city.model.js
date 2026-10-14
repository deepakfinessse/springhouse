import mongoose from "mongoose";
import { applySlugify } from "../utils/slugMiddleware.js";

const citySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "City name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    activeSolutions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Solution",
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

applySlugify(citySchema, "name");

export const City = mongoose.models.City || mongoose.model("City", citySchema);
