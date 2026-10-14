import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Amenity name is required"],
      trim: true,
    },
    featuredIcon: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Amenity =
  mongoose.models.Amenity || mongoose.model("Amenity", amenitySchema);
