import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/utils/db";
import { PR } from "@/model/pr.model";
import { uploadImage } from "@/utils/upload";

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const title = formData.get("title");
    const link = formData.get("link");
    const isActive = formData.get("isActive") === "true";
    const publishDate = formData.get("publishDate") || new Date();

    // Handle Image Upload
    const imageFile = formData.get("image");
    let imageURL = "";
    if (imageFile && imageFile.size > 0) {
      const path = await uploadImage(imageFile, "prs");
      if (path) imageURL = path;
    }

    const payload = {
      title,
      link,
      isActive,
      publishDate,
    };

    if (imageURL) payload.imageURL = imageURL;

    const newPR = await PR.create(payload);
    revalidatePath("/pr");

    return NextResponse.json({
      success: true,
      data: newPR,
      message: "PR created successfully",
    });
  } catch (error) {
    console.error("Create PR Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create PR" },
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
        { success: false, error: "No PR IDs provided" },
        { status: 400 },
      );
    }

    await PR.deleteMany({ _id: { $in: ids } });
    revalidatePath("/pr");

    return NextResponse.json({
      success: true,
      message: "PRs deleted successfully",
    });
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete PRs" },
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

    const [prs, total] = await Promise.all([
      PR.find({}).sort({ publishDate: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      PR.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: prs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("PRs fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch PRs" },
      { status: 500 },
    );
  }
}
