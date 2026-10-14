import connectDB from "@/utils/db";
import { Testimonial } from "@/model/testimonial.model";
import { NextResponse } from "next/server";
import { uploadImage } from "@/utils/upload";

export async function GET() {
  await connectDB();
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ success: true, data: testimonials });
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
      if (key === "featuredImage") continue;
      body[key] = formData.get(key);
    }

    const image = formData.get("featuredImage");
    if (image instanceof File) {
      const path = await uploadImage(image, "ourtestimonials");
      if (path) body.featuredImage = path;
    } else if (typeof image === "string") {
      body.featuredImage = image;
    }

    const testimonial = await Testimonial.create(body);
    return NextResponse.json(
      { success: true, data: testimonial },
      { status: 201 },
    );
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
        { success: false, error: "Testimonial ID is required" },
        { status: 400 },
      );
    }

    for (const key of formData.keys()) {
      if (key === "featuredImage" || key === "_id") continue;
      body[key] = formData.get(key);
    }

    const image = formData.get("featuredImage");
    if (image instanceof File) {
      const path = await uploadImage(image, "ourtestimonials");
      if (path) body.featuredImage = path;
    } else if (typeof image === "string") {
      body.featuredImage = image;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(_id, body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: testimonial });
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
        { success: false, error: "Testimonial ID is required" },
        { status: 400 },
      );
    }

    const deletedTestimonial = await Testimonial.findByIdAndDelete(_id);

    if (!deletedTestimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
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
