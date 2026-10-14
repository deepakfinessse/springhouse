import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { OtherPage } from "@/model/otherPage.model";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const page = await OtherPage.findById(id).lean();

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error("Fetch Single Page Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();

    const updatedPage = await OtherPage.findByIdAndUpdate(id, body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedPage) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPage,
      message: "Page updated successfully",
    });
  } catch (error) {
    console.error("Update Page Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update page" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedPage = await OtherPage.findByIdAndDelete(id);

    if (!deletedPage) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    console.error("Delete Page Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete page" },
      { status: 500 },
    );
  }
}
