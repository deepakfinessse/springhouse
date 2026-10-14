import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Property } from "@/model/property.model";
import { City } from "@/model/city.model";
import { Area } from "@/model/area.model";
import { Amenity } from "@/model/amenity.model";
import { Solution } from "@/model/solution.model";
import { uploadImage } from "@/utils/upload";
import { applySlugify } from "@/utils/slugMiddleware";

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();

    // Extract basic fields
    const name = formData.get("name");
    const propertyCode = formData.get("propertyCode");
    const description = formData.get("description");
    const slug = formData.get("slug"); // Optional, might be auto-generated
    const city = formData.get("city");
    const area = formData.get("area");
    const size = formData.get("size");
    const fullAddress = formData.get("fullAddress");
    const locationOnMap = formData.get("locationOnMap"); // Google Map Link
    const isActive = formData.get("isActive") === "true"; // "Published" vs "Draft"

    // Extract Arrays (Amenities, Solutions) - handled as multi-checkboxes usually sending multiple same-named keys or JSON strings
    // FormData.getAll() for multiple values
    const amenities = formData.getAll("amenities");
    const activeSolutions = formData.getAll("activeSolutions");

    // Handle Images
    const imageFiles = formData.getAll("images");
    const uploadedInames = [];

    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const path = await uploadImage(file, "properties");
        if (path) uploadedInames.push(path);
      }
    }

    const payload = {
      name,
      propertyCode,
      description,
      city: city || null,
      area: area || null,
      size: size ? Number(size) : 0,
      fullAddress,
      locationOnMap, // Usually "location" field in model is distinct or same? Model has `location` AND `locationOnMap`. `location` seems to be short text.
      location: formData.get("location"), // Short location text
      isActive,
      activeSolutions,
      images: uploadedInames,
      seo: {
        metaTitle: formData.get("seo[metaTitle]"),
        metaDescription: formData.get("seo[metaDescription]"),
        codeSnippet: formData.get("seo[codeSnippet]"),
      },
    };

    // logic for manual slug if provided
    if (slug) payload.slug = slug;

    const newProperty = await Property.create(payload);

    return NextResponse.json({
      success: true,
      data: newProperty,
      message: "Property created successfully",
    });
  } catch (error) {
    console.error("Create Property Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create property" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "No property IDs provided" },
        { status: 400 },
      );
    }

    await Property.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: "Properties deleted successfully",
    });
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete properties" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      Property.find({})
        .populate("city", "name slug")
        .populate("area", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Properties fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch properties" },
      { status: 500 },
    );
  }
}
