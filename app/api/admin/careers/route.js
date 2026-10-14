import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Career } from "@/model/career.model";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const isExport = searchParams.get("export") === "true";

    if (isExport) {
      // Build optional date filter
      const filter = {};
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");

      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        };
      }

      const allCareers = await Career.find(filter)
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({ success: true, data: allCareers });
    }

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const [careers, total] = await Promise.all([
      Career.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Career.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: careers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Careers fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applicants" },
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
        { success: false, error: "No applicant IDs provided" },
        { status: 400 },
      );
    }

    await Career.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: "Applicants deleted successfully",
    });
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete applicants" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const { id, isRead } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Applicant ID required" },
        { status: 400 },
      );
    }

    await Career.findByIdAndUpdate(id, { isRead });

    return NextResponse.json({
      success: true,
      message: "Applicant read status updated",
    });
  } catch (error) {
    console.error("Update Request Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update read status" },
      { status: 500 },
    );
  }
}
