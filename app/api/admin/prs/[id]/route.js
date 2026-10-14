import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/utils/db";
import { PR } from "@/model/pr.model";
import { uploadImage } from "@/utils/upload";
import slugify from "slugify";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const pr = await PR.findById(id).lean();

    if (!pr) {
      return NextResponse.json(
        { success: false, error: "PR not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: pr });
  } catch (error) {
    console.error("Fetch Single PR Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch PR" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const formData = await request.formData();

    const title = formData.get("title");
    const link = formData.get("link");
    const isActive = formData.get("isActive") === "true";
    const publishDate = formData.get("publishDate");

    const updateData = {
      title,
      link,
      isActive,
      ...(publishDate && { publishDate }),
    };

    if (title) {
      updateData.slug = slugify(title, { lower: true, strict: true });
    }

    // Handle Image Upload if new image provided
    const imageFile = formData.get("image");
    if (imageFile && imageFile.size > 0) {
      const path = await uploadImage(imageFile, "prs");
      if (path) updateData.imageURL = path;
    }

    const updatedPR = await PR.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
    revalidatePath("/pr");

    if (!updatedPR) {
      return NextResponse.json(
        { success: false, error: "PR not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPR,
      message: "PR updated successfully",
    });
  } catch (error) {
    console.error("Update PR Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update PR" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedPR = await PR.findByIdAndDelete(id);
    revalidatePath("/pr");

    if (!deletedPR) {
      return NextResponse.json(
        { success: false, error: "PR not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "PR deleted successfully",
    });
  } catch (error) {
    console.error("Delete PR Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete PR" },
      { status: 500 },
    );
  }
}
