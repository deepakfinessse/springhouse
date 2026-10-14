import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Testimonial } from "@/model/testimonial.model";
import { uploadImage } from "@/utils/upload";

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const clientName = formData.get("clientName");
    const companyName = formData.get("companyName");
    const review = formData.get("review");
    const isActive = formData.get("isActive") === "true";

    // Image Upload
    const imageFile = formData.get("featuredImage");
    let imagePath = "";
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      imagePath = await uploadImage(imageFile, "testimonials");
    }

    const newTestimonial = await Testimonial.create({
      clientName,
      companyName,
      review,
      isActive,
      featuredImage: imagePath,
    });

    return NextResponse.json({
      success: true,
      data: newTestimonial,
      message: "Testimonial created successfully",
    });
  } catch (error) {
    console.error("Create Testimonial Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create testimonial",
      },
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

    const [testimonials, total] = await Promise.all([
      Testimonial.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Testimonial.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: testimonials,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Testimonials Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
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
        { success: false, error: "No IDs provided" },
        { status: 400 },
      );
    }

    await Testimonial.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: "Testimonials deleted successfully",
    });
  } catch (error) {
    console.error("Delete Testimonials Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete testimonials" },
      { status: 500 },
    );
  }
}
