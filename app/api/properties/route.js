import connectDB from "@/utils/db";
import { Property } from "@/model/property.model";
import { Amenity } from "@/model/amenity.model";
import { Area } from "@/model/area.model";
import { City } from "@/model/city.model";
import { Solution } from "@/model/solution.model";
import { NextResponse } from "next/server";
import { uploadImage } from "@/utils/upload";

export async function GET() {
  await connectDB();
  try {
    const properties = await Property.find({})
      .populate("area")
      .populate("amenities")
      .populate("city")
      .populate("activeSolutions")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: properties });
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

    // Iterate over formData keys to build the body
    for (const key of formData.keys()) {
      if (key === "images") continue; // Handle images separately
      if (key === "amenities" || key === "activeSolutions") {
        body[key] = formData.getAll(key);
      } else {
        body[key] = formData.get(key);
      }
    }

    // Handle Images
    const images = formData.getAll("images");
    const uploadedImages = [];

    for (const image of images) {
      if (image instanceof File) {
        const path = await uploadImage(image, "properties");
        if (path) uploadedImages.push(path);
      } else if (typeof image === "string") {
        uploadedImages.push(image);
      }
    }

    body.images = uploadedImages;

    const property = await Property.create(body);
    return NextResponse.json(
      { success: true, data: property },
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
        { success: false, error: "Property ID is required" },
        { status: 400 },
      );
    }

    // Iterate over keys
    for (const key of formData.keys()) {
      if (key === "images" || key === "_id") continue;
      if (key === "amenities" || key === "activeSolutions") {
        body[key] = formData.getAll(key);
      } else {
        body[key] = formData.get(key);
      }
    }

    // Handle Images
    const images = formData.getAll("images");
    const uploadedImages = [];

    for (const image of images) {
      if (image instanceof File) {
        const path = await uploadImage(image, "properties");
        if (path) uploadedImages.push(path);
      } else if (typeof image === "string") {
        uploadedImages.push(image);
      }
    }

    body.images = uploadedImages;

    const property = await Property.findByIdAndUpdate(_id, body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: property });
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
        { success: false, error: "Property ID is required" },
        { status: 400 },
      );
    }

    const deletedProperty = await Property.findByIdAndDelete(_id);

    if (!deletedProperty) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
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
