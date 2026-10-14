import connectDB from "@/utils/db";
import { Blog } from "@/model/blog.model";
import { NextResponse } from "next/server";
import { uploadImage } from "@/utils/upload"; // Verify path

export async function GET() {
  await connectDB();
  try {
    const blogs = await Blog.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const body = {};

    for (const key of formData.keys()) {
      if (key === "imageURL") continue;
      body[key] = formData.get(key);
    }

    const image = formData.get("imageURL");
    if (image instanceof File) {
      const path = await uploadImage(image, "blogs");
      if (path) body.imageURL = path;
    } else if (typeof image === "string") {
      body.imageURL = image;
    }

    const blog = await Blog.create(body);
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const _id = formData.get("_id");
    const body = {};

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" },
        { status: 400 },
      );
    }

    for (const key of formData.keys()) {
      if (key === "imageURL" || key === "_id") continue;
      body[key] = formData.get(key);
    }

    const image = formData.get("imageURL");
    if (image instanceof File) {
      const path = await uploadImage(image, "blogs");
      if (path) body.imageURL = path;
    } else if (typeof image === "string") {
      body.imageURL = image;
    }

    const blog = await Blog.findByIdAndUpdate(_id, body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" },
        { status: 400 },
      );
    }

    const deletedBlog = await Blog.findByIdAndDelete(_id);

    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}
