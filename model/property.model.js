import mongoose from "mongoose";
import { applySlugify } from "../utils/slugMiddleware.js";

const propertySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "Property name is required"],
      trim: true,
    },
    propertyCode: {
      type: String,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
    location: {
      type: String,
    },
    size: {
      type: Number,
    },
    fullAddress: {
      type: String,
    },
    amenities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity",
      },
    ],
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    locationOnMap: {
      type: String,
    },
    activeSolutions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Solution",
      },
    ],
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

applySlugify(propertySchema, "name");

export const Property =
  mongoose.models.Property || mongoose.model("Property", propertySchema);
