import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Footer from "@/model/footer.model";
import { uploadImage } from "@/utils/upload";

export async function GET() {
  try {
    await connectDB();
    const footerData = await Footer.findOne();
    return NextResponse.json({ success: true, data: footerData || {} });
  } catch (error) {
    console.error("Footer Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer data" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const contentType = request.headers.get("content-type") || "";
    let body;
    let contactFormImageFile = null;
    let careerFormImageFile = null;
    let careerHeroBannerFile = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = JSON.parse(formData.get("data") || "{}");

      const contactImg = formData.get("contactFormImage");
      if (contactImg instanceof File) contactFormImageFile = contactImg;

      const careerImg = formData.get("careerFormImage");
      if (careerImg instanceof File) careerFormImageFile = careerImg;

      const careerBannerImg = formData.get("careerHeroBanner");
      if (careerBannerImg instanceof File) careerHeroBannerFile = careerBannerImg;
    } else {
      body = await request.json();
    }

    const updateData = {
      columns: body.columns || [],
      bottomBlocks: body.bottomBlocks || "",
      socialLinks: body.socialLinks || {
        instagram: "",
        facebook: "",
        linkedin: "",
      },
      contactInfo: body.contactInfo || {
        address: "",
        phone: "",
        whatsapp: "",
        email: "",
      },
      formImages: body.formImages || {
        contactFormImage: "",
        careerFormImage: "",
      },
      pageBanners: body.pageBanners || {
        careerHeroBanner: "",
      },
    };

    // Handle image uploads
    if (contactFormImageFile) {
      const path = await uploadImage(contactFormImageFile, "formimages");
      if (path) updateData.formImages.contactFormImage = path;
    }
    if (careerFormImageFile) {
      const path = await uploadImage(careerFormImageFile, "formimages");
      if (path) updateData.formImages.careerFormImage = path;
    }
    if (careerHeroBannerFile) {
      const path = await uploadImage(careerHeroBannerFile, "pagebanners");
      if (path) updateData.pageBanners.careerHeroBanner = path;
    }

    let footerData = await Footer.findOne();

    if (footerData) {
      footerData = await Footer.findByIdAndUpdate(footerData._id, updateData, {
        returnDocument: "after",
      });
    } else {
      footerData = await Footer.create(updateData);
    }

    return NextResponse.json({ success: true, data: footerData });
  } catch (error) {
    console.error("Footer Update Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update footer",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
