import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Amenity } from "@/model/amenity.model";
import { Property } from "@/model/property.model";
import { uploadImage } from "@/utils/upload"; // Verify path

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const result = await Amenity.aggregate([
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "amenities",
          as: "propertiesList",
        },
      },
      {
        $project: {
          name: 1,
          featuredIcon: 1,
          createdAt: 1,
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

    const amenities = result[0].data;
    const total = result[0].metadata[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: amenities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Amenities Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch amenities" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const name = formData.get("name");
    const imageFile = formData.get("image");

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Amenity name is required" },
        { status: 400 },
      );
    }

    let imagePath = "";
    if (imageFile && imageFile.size > 0) {
      imagePath = await uploadImage(imageFile, "amenities");
    }

    const newAmenity = await Amenity.create({
      name,
      featuredIcon: imagePath,
    });

    return NextResponse.json({
      success: true,
      data: newAmenity,
      message: "Amenity created successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Amenity already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create amenity" },
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
        { success: false, error: "No IDs provided" },
        { status: 400 },
      );
    }

    await Amenity.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: "Amenities deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete amenities" },
      { status: 500 },
    );
  }
}
