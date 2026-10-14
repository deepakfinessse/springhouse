import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { OtherPage } from "@/model/otherPage.model";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const newPage = await OtherPage.create(body);

    return NextResponse.json({
      success: true,
      data: newPage,
      message: "Page created successfully",
    });
  } catch (error) {
    console.error("Create Page Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create page" },
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
        { success: false, error: "No page IDs provided" },
        { status: 400 },
      );
    }

    await OtherPage.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: "Pages deleted successfully",
    });
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete pages" },
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

    const [pages, total] = await Promise.all([
      OtherPage.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      OtherPage.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: pages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Pages fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pages" },
      { status: 500 },
    );
  }
}
