import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Area } from "@/model/area.model";
import { Property } from "@/model/property.model";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const result = await Area.aggregate([
      {
        $lookup: {
          from: "cities",
          localField: "city",
          foreignField: "_id",
          as: "cityData",
        },
      },
      {
        $unwind: {
          path: "$cityData",
          preserveNullAndEmptyArrays: true, // In case city is deleted/missing
        },
      },
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "area",
          as: "propertiesList",
        },
      },
      {
        $project: {
          name: 1,
          cityId: "$cityData._id",
          cityName: { $ifNull: ["$cityData.name", "Unknown City"] },
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

    const areas = result[0].data;
    const total = result[0].metadata[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: areas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Areas Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch areas" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { name, city } = await request.json();

    if (!name || !city) {
      return NextResponse.json(
        { success: false, error: "Name and City are required" },
        { status: 400 },
      );
    }

    const newArea = await Area.create({ name, city });

    return NextResponse.json({
      success: true,
      data: newArea,
      message: "Area created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create area" },
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
        { success: false, error: "No area IDs provided" },
        { status: 400 },
      );
    }

    await Area.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: "Areas deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete areas" },
      { status: 500 },
    );
  }
}
