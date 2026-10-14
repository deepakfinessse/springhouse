import connectDB from "@/utils/db";
import { Amenity } from "@/model/amenity.model";
import { NextResponse } from "next/server";
import { uploadImage } from "@/utils/upload";

export async function GET() {
  await connectDB();
  try {
    const amenities = await Amenity.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: amenities });
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
      if (key === "featuredIcon") continue;
      body[key] = formData.get(key);
    }

    const image = formData.get("featuredIcon");
    if (image instanceof File) {
      const path = await uploadImage(image, "amenities");
      if (path) body.featuredIcon = path;
    } else if (typeof image === "string") {
      body.featuredIcon = image;
    }

    const amenity = await Amenity.create(body);
    return NextResponse.json({ success: true, data: amenity }, { status: 201 });
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
        { success: false, error: "Amenity ID is required" },
        { status: 400 },
      );
    }

    for (const key of formData.keys()) {
      if (key === "featuredIcon" || key === "_id") continue;
      body[key] = formData.get(key);
    }

    const image = formData.get("featuredIcon");
    if (image instanceof File) {
      const path = await uploadImage(image, "amenities");
      if (path) body.featuredIcon = path;
    } else if (typeof image === "string") {
      body.featuredIcon = image;
    }

    const amenity = await Amenity.findByIdAndUpdate(_id, body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!amenity) {
      return NextResponse.json(
        { success: false, error: "Amenity not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: amenity });
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
        { success: false, error: "Amenity ID is required" },
        { status: 400 },
      );
    }

    const deletedAmenity = await Amenity.findByIdAndDelete(_id);

    if (!deletedAmenity) {
      return NextResponse.json(
        { success: false, error: "Amenity not found" },
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
