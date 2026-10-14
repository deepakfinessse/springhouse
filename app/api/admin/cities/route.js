import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { City } from "@/model/city.model";
import { Area } from "@/model/area.model";
import { Property } from "@/model/property.model";
import { uploadImage } from "@/utils/upload";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const result = await City.aggregate([
      {
        $lookup: {
          from: "areas",
          localField: "_id",
          foreignField: "city",
          as: "areasList",
        },
      },
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "city",
          as: "propertiesList",
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          createdAt: 1,
          areaCount: { $size: "$areasList" },
          propertyCount: { $size: "$propertiesList" },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const cities = result[0].data;
    const total = result[0].metadata[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: cities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Cities Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cities" },
      { status: 500 },
    );
  }
}

// Import uploadImage at the top if not present, but I can't see the top imports easily in replace.
// I will assume the imports need to be added.
// Wait, I can't add imports with replace_file_content easily if I don't target them.
// I'll update the whole file or huge chunks. The file is small enough.
// Actually, I'll use `replace_file_content` for the POST method and assume I need to add the import.
// Let's check imports first.
export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const name = formData.get("name");
    if (!name) {
      return NextResponse.json(
        { success: false, error: "City name is required" },
        { status: 400 },
      );
    }

    const slug = formData.get("slug");
    const description = formData.get("description");
    const isActive = formData.get("isActive") === "true";


    // Active Solutions
    const activeSolutions = formData.getAll("activeSolutions");


    // Images
    const imageFile = formData.get("image");
    let imagePath = "";
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      imagePath = await uploadImage(imageFile, "cities");
    }


    const payload = {
      name,
      description,
      isActive,
      activeSolutions,
      image: imagePath,
      seo: {
        metaTitle: formData.get("seo[metaTitle]"),
        metaDescription: formData.get("seo[metaDescription]"),
        codeSnippet: formData.get("seo[codeSnippet]"),
      },
    };

    if (slug) payload.slug = slug;

    const newCity = await City.create(payload);

    return NextResponse.json({
      success: true,
      data: newCity,
      message: "City created successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "City with this name already exists" },
        { status: 400 },
      );
    }
    console.error("Create City Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create city" },
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
        { success: false, error: "No city IDs provided" },
        { status: 400 },
      );
    }

    // Optional: Check dependencies (areas/properties) before delete?
    // For now, simple delete. Mongoose middleware might handle cascade if configured, but usually not default.
    // If strict, we should prevent deleting cities that have areas/properties.
    // But for "Quick Management", let's allow it but maybe warn?
    // The requirement didn't specify strict constraints, so standard delete.

    await City.deleteMany({ _id: { $in: ids } });

    // Also delete associated Areas? Or leave them orphaned?
    // Better to delete associated areas to keep DB clean.
    await Area.deleteMany({ city: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: "Cities deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete cities" },
      { status: 500 },
    );
  }
}
