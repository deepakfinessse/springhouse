import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    contactNumber: {
      type: Number,
    },
    applyingFor: {
      type: String,
    },
    resume: {
      type: String,
    },
    linkedinURL: {
      type: String,
    },
    whyWannaJoin: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

if (mongoose.models.Career) {
  delete mongoose.models.Career;
}
export const Career = mongoose.model("Career", careerSchema);
