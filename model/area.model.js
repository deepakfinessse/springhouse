import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Area name is required"],
      trim: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
  },
  { timestamps: true },
);

export const Area = mongoose.models.Area || mongoose.model("Area", areaSchema);
