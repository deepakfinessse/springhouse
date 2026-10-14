import connectDB from "@/utils/db";
import { Solution } from "@/model/solution.model";
import { Testimonial } from "@/model/testimonial.model";
import { Property } from "@/model/property.model";
import { NextResponse } from "next/server";
import { uploadImage } from "@/utils/upload";

export async function GET() {
  await connectDB();
  try {
    const solutions = await Solution.find({ isActive: true })
      .populate("testimonials")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: solutions });
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

    // Standard fields
    for (const key of formData.keys()) {
      if (key === "image" || key === "companyImages") continue;
      if (
        key === "fourPoints" ||
        key === "testimonials" ||
        key === "activeProperties"
      ) {
        body[key] = formData.getAll(key);
      } else if (key === "featuredSpaces") {
        // Complex array of objects - expect stringified JSON
        const fs = formData.get(key);
        if (fs) body[key] = JSON.parse(fs);
      } else {
        body[key] = formData.get(key);
      }
    }

    // Single Image
    const image = formData.get("image");
    if (image instanceof File) {
      const path = await uploadImage(image, "solutions");
      if (path) body.image = path;
    } else if (typeof image === "string") {
      body.image = image;
    }

    // Array of Images (companyImages)
    const companyImages = formData.getAll("companyImages");
    const uploadedCompanyImages = [];
    for (const img of companyImages) {
      if (img instanceof File) {
        const path = await uploadImage(img, "solutions");
        if (path) uploadedCompanyImages.push(path);
      } else if (typeof img === "string") {
        uploadedCompanyImages.push(img);
      }
    }
    body.companyImages = uploadedCompanyImages;

    const solution = await Solution.create(body);
    return NextResponse.json(
      { success: true, data: solution },
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
        { success: false, error: "Solution ID is required" },
        { status: 400 },
      );
    }

    // Standard fields
    for (const key of formData.keys()) {
      if (key === "image" || key === "companyImages" || key === "_id") continue;
      if (
        key === "fourPoints" ||
        key === "testimonials" ||
        key === "activeProperties"
      ) {
        body[key] = formData.getAll(key);
      } else if (key === "featuredSpaces") {
        const fs = formData.get(key);
        if (fs) body[key] = JSON.parse(fs);
      } else {
        body[key] = formData.get(key);
      }
    }

    // Single Image
    const image = formData.get("image");
    if (image instanceof File) {
      const path = await uploadImage(image, "solutions");
      if (path) body.image = path;
    } else if (typeof image === "string") {
      body.image = image;
    }

    // Array of Images (companyImages)
    const companyImages = formData.getAll("companyImages");
    const uploadedCompanyImages = [];
    for (const img of companyImages) {
      if (img instanceof File) {
        const path = await uploadImage(img, "solutions");
        if (path) uploadedCompanyImages.push(path);
      } else if (typeof img === "string") {
        uploadedCompanyImages.push(img);
      }
    }
    body.companyImages = uploadedCompanyImages;

    const solution = await Solution.findByIdAndUpdate(_id, body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!solution) {
      return NextResponse.json(
        { success: false, error: "Solution not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: solution });
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
        { success: false, error: "Solution ID is required" },
        { status: 400 },
      );
    }

    const deletedSolution = await Solution.findByIdAndDelete(_id);

    if (!deletedSolution) {
      return NextResponse.json(
        { success: false, error: "Solution not found" },
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
