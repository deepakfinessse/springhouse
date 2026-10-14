import connectDB from "@/utils/db";
import { Area } from "@/model/area.model";
import { City } from "@/model/city.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const areas = await Area.find({}).populate("city").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: areas });
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
    const area = await Area.create(body);
    return NextResponse.json({ success: true, data: area }, { status: 201 });
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
        { success: false, error: "Area ID is required" },
        { status: 400 },
      );
    }

    const area = await Area.findByIdAndUpdate(_id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!area) {
      return NextResponse.json(
        { success: false, error: "Area not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: area });
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
        { success: false, error: "Area ID is required" },
        { status: 400 },
      );
    }

    const deletedArea = await Area.findByIdAndDelete(_id);

    if (!deletedArea) {
      return NextResponse.json(
        { success: false, error: "Area not found" },
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
