import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Testimonial } from "@/model/testimonial.model";
import { uploadImage } from "@/utils/upload";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params; // Await params for Next.js 15+
    console.log("Fetching testimonial with ID:", id);

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      console.log("Testimonial not found for ID:", id);
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error("Fetch Testimonial Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonial" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params; // Await params
    console.log("Updating testimonial ID:", id);

    const formData = await request.formData();

    const existingTestimonial = await Testimonial.findById(id);
    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 },
      );
    }

    const clientName = formData.get("clientName");
    const companyName = formData.get("companyName");
    const review = formData.get("review");
    const isActive = formData.get("isActive") === "true";

    // Image Handling
    const imageFile = formData.get("featuredImage");
    let imagePath = existingTestimonial.featuredImage;

    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      imagePath = await uploadImage(imageFile, "testimonials");
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      {
        clientName,
        companyName,
        review,
        isActive,
        featuredImage: imagePath,
      },
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({
      success: true,
      data: updatedTestimonial,
      message: "Testimonial updated successfully",
    });
  } catch (error) {
    console.error("Update Testimonial Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update testimonial" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params; // Await params
    console.log("Deleting testimonial ID:", id);

    await Testimonial.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Delete Testimonial Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete testimonial" },
      { status: 500 },
    );
  }
}
