import connectDB from "@/utils/db";
import { City } from "@/model/city.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const cities = await City.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: cities });
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
    const city = await City.create(body);
    return NextResponse.json({ success: true, data: city }, { status: 201 });
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
        { success: false, error: "City ID is required" },
        { status: 400 },
      );
    }

    const city = await City.findByIdAndUpdate(_id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!city) {
      return NextResponse.json(
        { success: false, error: "City not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: city });
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
        { success: false, error: "City ID is required" },
        { status: 400 },
      );
    }

    const deletedCity = await City.findByIdAndDelete(_id);

    if (!deletedCity) {
      return NextResponse.json(
        { success: false, error: "City not found" },
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
