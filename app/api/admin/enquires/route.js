import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Enquiry } from "@/model/enquiry.model";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // --- Export mode (no pagination) ---
    if (searchParams.get("export") === "true") {
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");

      const filter = {};
      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        };
      }

      const enquiries = await Enquiry.find(filter)
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({ success: true, data: enquiries });
    }

    // --- Normal paginated mode ---
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const [enquiries, total] = await Promise.all([
      Enquiry.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Enquiry.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: enquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Enquiries fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch enquiries" },
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
        { success: false, error: "No enquiry IDs provided" },
        { status: 400 },
      );
    }

    await Enquiry.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: "Enquiries deleted successfully",
    });
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete enquiries" },
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
        { success: false, error: "Enquiry ID required" },
        { status: 400 },
      );
    }

    await Enquiry.findByIdAndUpdate(id, { isRead });

    return NextResponse.json({
      success: true,
      message: "Enquiry read status updated",
    });
  } catch (error) {
    console.error("Update Request Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update read status" },
      { status: 500 },
    );
  }
}
