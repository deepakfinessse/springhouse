import connectDB from "@/utils/db";
import { Career } from "@/model/career.model";
import { NextResponse } from "next/server";
import { uploadImage } from "@/utils/upload";

export async function GET() {
  await connectDB();
  try {
    const careers = await Career.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: careers });
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
      if (key === "resume") continue;
      body[key] = formData.get(key);
    }

    const resume = formData.get("resume");
    if (resume instanceof File) {
      const path = await uploadImage(resume, "resumes", "public/assets", {
        allowedTypes: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });
      if (path) body.resume = path;
    } else if (typeof resume === "string") {
      body.resume = resume;
    }

    const career = await Career.create(body);
    return NextResponse.json({ success: true, data: career }, { status: 201 });
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
        { success: false, error: "Career Application ID is required" },
        { status: 400 },
      );
    }

    const deletedCareer = await Career.findByIdAndDelete(_id);

    if (!deletedCareer) {
      return NextResponse.json(
        { success: false, error: "Career Application not found" },
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
