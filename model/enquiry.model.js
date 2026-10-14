import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: [true, "Phone number is required"],
    },
    selectCity: {
      type: String,
    },
    selectProperty: {
      type: String,
    },
    selectSolution: {
      type: String,
    },
    deskRequirement: {
      type: Number,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

if (mongoose.models.Enquiry) {
  delete mongoose.models.Enquiry;
}
export const Enquiry = mongoose.model("Enquiry", enquirySchema);
