import connectDB from "@/utils/db";
import { FAQ } from "@/model/faq.model";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { sections } = body;

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data format. Expected an array of sections.",
        },
        { status: 400 },
      );
    }

    // 1. Fetch all existing FAQs from the database to compare against incoming
    const existingFaqs = await FAQ.find({});
    const existingIds = existingFaqs.map((faq) => faq._id.toString());

    const incomingIds = sections.filter((s) => s._id).map((s) => s._id);

    // 2. Identify and delete sections that exist in DB but were removed from frontend
    const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id));
    if (idsToDelete.length > 0) {
      await FAQ.deleteMany({ _id: { $in: idsToDelete } });
    }

    // 3. Update existing or Create new sections
    const operationPromises = sections.map(async (section) => {
      if (section._id) {
        // Update existing
        const { _id, ...updateData } = section;
        return FAQ.findByIdAndUpdate(_id, updateData, {
          returnDocument: "after",
          runValidators: true,
        });
      } else {
        // Create new
        return FAQ.create(section);
      }
    });

    await Promise.all(operationPromises);

    return NextResponse.json({
      success: true,
      message: "FAQs synced successfully",
    });
  } catch (error) {
    console.error("Bulk FAQ Sync Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync FAQs" },
      { status: 500 },
    );
  }
}
