import connectDB from "@/utils/db";
import { OtherPage } from "@/model/otherPage.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const otherPages = await OtherPage.find({ isActive: true }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ success: true, data: otherPages });
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
    const body = await request.json();
    const otherPage = await OtherPage.create(body);
    return NextResponse.json(
      { success: true, data: otherPage },
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
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Page ID is required" },
        { status: 400 },
      );
    }

    const otherPage = await OtherPage.findByIdAndUpdate(_id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!otherPage) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: otherPage });
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
        { success: false, error: "Page ID is required" },
        { status: 400 },
      );
    }

    const deletedPage = await OtherPage.findByIdAndDelete(_id);

    if (!deletedPage) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
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
