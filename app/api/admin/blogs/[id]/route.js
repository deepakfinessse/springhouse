import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/utils/db";
import { Blog } from "@/model/blog.model";
import { uploadImage } from "@/utils/upload";
import { applySlugify } from "@/utils/slugMiddleware";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error("Fetch Single Blog Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // We expect FormData because an image might be updated
    const formData = await request.formData();

    const title = formData.get("title");
    const slug = formData.get("slug");
    const content = formData.get("content");
    const isActive = formData.get("isActive") === "true";
    const publishDate = formData.get("publishDate");

    const updateData = {
      title,
      content,
      isActive,
      ...(publishDate && { publishDate }),
      seo: {
        metaTitle: formData.get("seo[metaTitle]") || "",
        metaDescription: formData.get("seo[metaDescription]") || "",
        codeSnippet: formData.get("seo[codeSnippet]") || "",
      },
    };

    if (slug) updateData.slug = slug;

    // Handle Image Upload if new image provided
    const imageFile = formData.get("image");
    if (imageFile && imageFile.size > 0) {
      const path = await uploadImage(imageFile, "blogs");
      if (path) updateData.imageURL = path;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
    revalidatePath("/blogs");

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBlog,
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.error("Update Blog Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update blog" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedBlog = await Blog.findByIdAndDelete(id);
    revalidatePath("/blogs");

    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
