import connectDB from "@/utils/db";
import { Homepage } from "@/model/homepage.model";
import { City } from "@/model/city.model";
import { Testimonial } from "@/model/testimonial.model";
import { NextResponse } from "next/server";
import { uploadImage } from "@/utils/upload";

export async function GET() {
  await connectDB();
  try {
    let homepage = await Homepage.findOne({});

    if (!homepage) {
      return NextResponse.json({ success: true, data: null });
    }

    homepage = await homepage.populate("activeCities");
    homepage = await homepage.populate("testimonials");

    return NextResponse.json({ success: true, data: homepage });
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

    // 1. Handle Simple Fields & JSON Objects
    for (const key of formData.keys()) {
      if (
        [
          "mainBanner",
          "solutionsForEveryoneImage",
          "networkingImage",
          "ourCommunity",
        ].includes(key)
      )
        continue;
      if (key.startsWith("featureImage_")) continue;

      if (["solutionsForEveryone", "networking", "features"].includes(key)) {
        try {
          body[key] = JSON.parse(formData.get(key));
        } catch (e) {
          console.error(`Error parsing JSON for ${key}`, e);
        }
      } else if (key === "activeCities" || key === "testimonials") {
        // Arrays of IDs
        body[key] = formData.getAll(key);
      } else {
        body[key] = formData.get(key);
      }
    }

    // 2. Handle Main Banner
    const mainBanner = formData.get("mainBanner");
    if (mainBanner instanceof File) {
      const path = await uploadImage(mainBanner, "bannerimage");
      if (path) body.mainBanner = path;
    } else if (typeof mainBanner === "string") {
      body.mainBanner = mainBanner;
    }

    // 3. Handle solutionsForEveryone Image
    // Ensure body.solutionsForEveryone exists (it should from JSON parse)
    if (!body.solutionsForEveryone) body.solutionsForEveryone = {};
    const sfeImage = formData.get("solutionsForEveryoneImage");
    if (sfeImage instanceof File) {
      const path = await uploadImage(sfeImage, "manageoffice");
      if (path) body.solutionsForEveryone.image = path;
    } else if (typeof sfeImage === "string") {
      body.solutionsForEveryone.image = sfeImage;
    }

    // 4. Handle networking Image
    if (!body.networking) body.networking = {};
    const netImage = formData.get("networkingImage");
    if (netImage instanceof File) {
      const path = await uploadImage(netImage, "homenetworking");
      if (path) body.networking.image = path;
    } else if (typeof netImage === "string") {
      body.networking.image = netImage;
    }

    // 5. Handle ourCommunity (Array of Images)
    const comImages = formData.getAll("ourCommunity");
    const uploadedComImages = [];
    for (const img of comImages) {
      if (img instanceof File) {
        const path = await uploadImage(img, "ourcommunity");
        if (path) uploadedComImages.push(path);
      } else if (typeof img === "string") {
        uploadedComImages.push(img);
      }
    }
    body.ourCommunity = uploadedComImages;

    // 6. Handle Features Images (featureImage_0, featureImage_1, etc.)
    if (body.features && Array.isArray(body.features)) {
      for (let i = 0; i < body.features.length; i++) {
        const fKey = `featureImage_${i}`;
        const fImage = formData.get(fKey);

        if (fImage instanceof File) {
          const path = await uploadImage(fImage, "features");
          if (path) body.features[i].image = path;
        }
        // If string or undefined, assume it's already in the JSON or unchanged
      }
    }

    const homepage = await Homepage.findOneAndUpdate({}, body, {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });

    return NextResponse.json(
      { success: true, data: homepage },
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
  // PUT logic is identical to POST because it's a singleton upsert
  return POST(request);
}
