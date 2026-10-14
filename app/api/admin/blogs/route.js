import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/utils/db";
import { Blog } from "@/model/blog.model";
import { uploadImage } from "@/utils/upload";
import { applySlugify } from "@/utils/slugMiddleware";

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const title = formData.get("title");
    const slug = formData.get("slug");
    const content = formData.get("content");
    const isActive = formData.get("isActive") === "true";
    const publishDate = formData.get("publishDate") || new Date();

    // Handle Image Upload
    const imageFile = formData.get("image");
    let imageURL = "";
    if (imageFile && imageFile.size > 0) {
      const path = await uploadImage(imageFile, "blogs");
      if (path) imageURL = path;
    }

    const payload = {
      title,
      content,
      isActive,
      publishDate,
      seo: {
        metaTitle: formData.get("seo[metaTitle]") || "",
        metaDescription: formData.get("seo[metaDescription]") || "",
        codeSnippet: formData.get("seo[codeSnippet]") || "",
      },
    };

    if (imageURL) payload.imageURL = imageURL;
    if (slug) payload.slug = slug;

    const newBlog = await Blog.create(payload);
    revalidatePath("/blogs");

    return NextResponse.json({
      success: true,
      data: newBlog,
      message: "Blog created successfully",
    });
  } catch (error) {
    console.error("Create Blog Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create blog" },
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
        { success: false, error: "No blog IDs provided" },
        { status: 400 },
      );
    }

    await Blog.deleteMany({ _id: { $in: ids } });
    revalidatePath("/blogs");

    return NextResponse.json({
      success: true,
      message: "Blogs deleted successfully",
    });
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blogs" },
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

    const [blogs, total] = await Promise.all([
      Blog.find({}).sort({ publishDate: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Blogs fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 },
    );
  }
}
