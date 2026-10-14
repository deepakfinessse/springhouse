import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { AboutUs } from "@/model/aboutUs.model";
import { uploadImage } from "@/utils/upload";

export async function GET() {
  try {
    await connectDB();
    const aboutUs = await AboutUs.findOne();
    return NextResponse.json({ success: true, data: aboutUs || {} });
  } catch (error) {
    console.error("AboutUs Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch about us data" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const formData = await request.formData();

    let aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      aboutUs = await AboutUs.create({});
    }

    // Basic Fields
    const heading = formData.get("heading") || "";

    // Banner Image
    const mainBannerFile = formData.get("mainBanner");
    let mainBannerPath = aboutUs.mainBanner || "";
    if (
      mainBannerFile &&
      typeof mainBannerFile === "object" &&
      mainBannerFile.size > 0
    ) {
      mainBannerPath = await uploadImage(mainBannerFile, "about-us/hero");
    }



    // Array - History (dynamic)
    const history = [];
    let i = 0;
    while (formData.has(`history[${i}][year]`)) {
      history.push({
        year: formData.get(`history[${i}][year]`) || "",
        content: formData.get(`history[${i}][content]`) || "",
      });
      i++;
    }

    // Array - Why Us (4 items)
    const whyUs = [];
    for (let j = 0; j < 4; j++) {
      whyUs.push(formData.get(`whyUs[${j}]`) || "");
    }

    // Array - Who Are We (4 items)
    const whoAreWe = [];
    for (let k = 0; k < 4; k++) {
      let frontImgPath = aboutUs.whoAreWe?.[k]?.frontImg || "";
      let backImgPath = aboutUs.whoAreWe?.[k]?.backImg || "";
      
      const frontFile = formData.get(`whoAreWe[${k}][frontImg]`);
      if (frontFile && typeof frontFile === "object" && frontFile.size > 0) {
        frontImgPath = await uploadImage(frontFile, "about-us/who-are-we");
      }
      
      const backFile = formData.get(`whoAreWe[${k}][backImg]`);
      if (backFile && typeof backFile === "object" && backFile.size > 0) {
        backImgPath = await uploadImage(backFile, "about-us/who-are-we");
      }

      whoAreWe.push({
        title: formData.get(`whoAreWe[${k}][title]`) || "",
        description: formData.get(`whoAreWe[${k}][description]`) || "",
        isReverse: formData.get(`whoAreWe[${k}][isReverse]`) === "true",
        frontImg: frontImgPath,
        backImg: backImgPath,
      });
    }

    // Update Payload
    aboutUs.heading = heading;
    aboutUs.mainBanner = mainBannerPath;
    aboutUs.history = history;
    aboutUs.whyUs = whyUs;
    aboutUs.whoAreWe = whoAreWe;
    aboutUs.seo = {
      metaTitle: formData.get("seo[metaTitle]") || "",
      metaDescription: formData.get("seo[metaDescription]") || "",
      codeSnippet: formData.get("seo[codeSnippet]") || "",
    };

    await aboutUs.save();

    return NextResponse.json({
      success: true,
      data: aboutUs,
      message: "About Us updated successfully",
    });
  } catch (error) {
    console.error("AboutUs Update Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update about us" },
      { status: 500 },
    );
  }
}
