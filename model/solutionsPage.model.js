import mongoose from "mongoose";

const solutionsPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
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

export const SolutionsPage =
  mongoose.models.SolutionsPage ||
  mongoose.model("SolutionsPage", solutionsPageSchema);
