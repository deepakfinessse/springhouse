import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Property } from "@/model/property.model";
import { Amenity } from "@/model/amenity.model";
import { Area } from "@/model/area.model";
import { City } from "@/model/city.model";
import { Solution } from "@/model/solution.model";
import { uploadImage } from "@/utils/upload";
import { applySlugify } from "@/utils/slugMiddleware";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const property = await Property.findById(id).populate(
      "city area amenities activeSolutions",
    );

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch property" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const formData = await request.formData();

    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 },
      );
    }

    // Extract basic fields
    const name = formData.get("name");
    const propertyCode = formData.get("propertyCode");
    const description = formData.get("description");
    const slug = formData.get("slug");
    const city = formData.get("city");
    const area = formData.get("area");
    const size = formData.get("size");
    const fullAddress = formData.get("fullAddress");
    const locationOnMap = formData.get("locationOnMap");
    const location = formData.get("location");
    const isActive = formData.get("isActive") === "true";

    // Extract Arrays
    const amenities = formData.getAll("amenities");
    const activeSolutions = formData.getAll("activeSolutions");

    // Handle Images
    // Logic: If images are sent in formData, it might be new images to ADD or REPLACE?
    // User usually expects append or replace. Admin UI typically has "delete image" buttons and "upload new".
    // For simplicity in this "Update" context, let's assume we might receive:
    // 1. `existingImages` (URLs)
    // 2. `images` (New Files)
    // And we merge them.
    const existingImagesList = formData.getAll("existingImages"); // URLs
    const newImageFiles = formData.getAll("images"); // Files

    const finalImages = [...existingImagesList];

    for (const file of newImageFiles) {
      if (file && typeof file === "object" && file.size > 0) {
        const path = await uploadImage(file, "properties");
        if (path) finalImages.push(path);
      }
    }

    const updatePayload = {
      name,
      propertyCode,
      description,
      city: city || null,
      area: area || null,
      size: size ? Number(size) : 0,
      fullAddress,
      locationOnMap,
      location,
      isActive,
      amenities,
      activeSolutions,
      images: finalImages,
      seo: {
        metaTitle: formData.get("seo[metaTitle]"),
        metaDescription: formData.get("seo[metaDescription]"),
        codeSnippet: formData.get("seo[codeSnippet]"),
      },
    };

    if (slug && slug !== existingProperty.slug) {
      updatePayload.slug = slug;
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updatePayload,
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({
      success: true,
      data: updatedProperty,
      message: "Property updated successfully",
    });
  } catch (error) {
    console.error("Update Property Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update property" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete property" },
      { status: 500 },
    );
  }
}
