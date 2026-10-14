import mongoose from "mongoose";
import { applySlugify } from "../utils/slugMiddleware.js";

const solutionSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "Solution name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    fourPoints: [
      {
        type: String,
      },
    ],
    testimonials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Testimonial",
      },
    ],
    companyImages: [
      {
        backgroundImage: String,
        logo: String,
        link: String,
      },
    ],
    featuredSpaces: [
      {
        name: String,
        image: String,
      },
    ],
    visibleSections: {
      type: [String],
      default: [
        "intro",
        "testimonials",
        "companyImages",
        "featuredSpaces",
        "availableProperties",
        "ourCommunity",
        "networking",
        "otherSolutions",
        "contactForm",
      ],
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

applySlugify(solutionSchema, "name");

export const Solution =
  mongoose.models.Solution || mongoose.model("Solution", solutionSchema);

