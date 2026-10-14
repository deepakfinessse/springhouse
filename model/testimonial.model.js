import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    review: {
      type: String,
    },
    featuredImage: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Testimonial =
  mongoose.models.Testimonial ||
  mongoose.model("Testimonial", testimonialSchema);
