import connectDB from "@/utils/db";
import { AboutUs } from "@/model/aboutUs.model";
import { NextResponse } from "next/server";
import { uploadImage } from "@/utils/upload";

export async function GET() {
  await connectDB();
  try {
    const aboutUs = await AboutUs.findOne({});
    return NextResponse.json({ success: true, data: aboutUs || null });
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
      if (key === "mainBanner") continue;
      // Handle arrays of objects (history, presence) -> JSON parse
      // Handle arrays of strings (whyUs, whoAreWe) -> getAll
      if (["history", "presence"].includes(key)) {
        try {
          body[key] = JSON.parse(formData.get(key));
        } catch (e) {
          console.error(e);
        }
      } else if (["whyUs", "whoAreWe"].includes(key)) {
        body[key] = formData.getAll(key);
      } else {
        body[key] = formData.get(key);
      }
    }

    const mainBanner = formData.get("mainBanner");
    if (mainBanner instanceof File) {
      const path = await uploadImage(mainBanner, "aboutus");
      if (path) body.mainBanner = path;
    } else if (typeof mainBanner === "string") {
      body.mainBanner = mainBanner;
    }

    let aboutUs = await AboutUs.findOne({});

    if (aboutUs) {
      aboutUs.set(body);
    } else {
      aboutUs = new AboutUs(body);
    }

    await aboutUs.save();

    return NextResponse.json({ success: true, data: aboutUs }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

export async function PUT(request) {
  // Singleton pattern - PUT is same as POST
  return POST(request);
}
