import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Amenity } from "@/model/amenity.model";
import { uploadImage } from "@/utils/upload";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const formData = await request.formData();
    const name = formData.get("name");
    const imageFile = formData.get("image");

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 },
      );
    }

    const updateData = { name };

    if (imageFile && imageFile.size > 0) {
      const imagePath = await uploadImage(imageFile, "amenities");
      updateData.featuredIcon = imagePath;
    }

    const updatedAmenity = await Amenity.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedAmenity) {
      return NextResponse.json(
        { success: false, error: "Amenity not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedAmenity,
      message: "Amenity updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update amenity" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await Amenity.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Failed" },
      { status: 500 },
    );
  }
}
