import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Area } from "@/model/area.model";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { name, city } = await request.json();

    if (!name || !city) {
      return NextResponse.json(
        { success: false, error: "Name and City are required" },
        { status: 400 },
      );
    }

    const updatedArea = await Area.findByIdAndUpdate(
      id,
      { name, city },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedArea) {
      return NextResponse.json(
        { success: false, error: "Area not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedArea,
      message: "Area updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update area" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await Area.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Failed" },
      { status: 500 },
    );
  }
}
