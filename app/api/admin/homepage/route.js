import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Homepage } from "@/model/homepage.model";
import { City } from "@/model/city.model";
import { Solution } from "@/model/solution.model";
import { Testimonial } from "@/model/testimonial.model";
import { uploadImage } from "@/utils/upload";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    // Use findOne to get the singleton, populate necessary fields if needed.
    // Actually, populating in admin might not be strictly needed for checkboxes if we just load all cities/testimonials separately,
    // but it's fine to return the plain arrays of ObjectIds for the form state.
    let homepage = await Homepage.findOne();

    // If it doesn't exist, create an empty one
    if (!homepage) {
      homepage = await Homepage.create({
        presence: [{}, {}, {}, {}],
        features: [{}, {}, {}, {}],
      });
    }

    return NextResponse.json({ success: true, data: homepage });
  } catch (error) {
    console.error("Homepage Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch homepage data" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const formData = await request.formData();

    let homepage = await Homepage.findOne();
    if (!homepage) {
      homepage = await Homepage.create({});
    }

    // Basic Fields
    const heading = formData.get("heading");
    const subHeading = formData.get("subHeading");

    // Arrays - Presence (4 items)
    const presence = [];
    for (let i = 0; i < 4; i++) {
      presence.push({
        number: Number(formData.get(`presence[${i}][number]`)) || null,
        title: formData.get(`presence[${i}][title]`) || "",
        beforeNumber: formData.get(`presence[${i}][beforeNumber]`) || "",
        afterNumber: formData.get(`presence[${i}][afterNumber]`) || "",
      });
    }

    // Active Cities
    const activeCities = formData.getAll("activeCities");

    // Active Solutions
    const activeSolutions = formData.getAll("activeSolutions");

    // Features (4 items)
    const features = [];
    for (let i = 0; i < 4; i++) {
      const content = formData.get(`features[${i}][content]`) || "";
      const imageFile = formData.get(`features[${i}][image]`);

      // Preserve existing image if no new file is uploaded
      let imagePath = homepage.features?.[i]?.image || "";

      if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
        imagePath = await uploadImage(imageFile, "homepage/features");
      }

      features.push({
        content,
        image: imagePath,
      });
    }

    // Solutions For Everyone
    const solutionContent = formData.get("solutionsForEveryone[content]") || "";
    const solutionImageFile = formData.get("solutionsForEveryoneImage");
    let solutionImagePath = homepage.solutionsForEveryone?.image || "";
    if (
      solutionImageFile &&
      typeof solutionImageFile === "object" &&
      solutionImageFile.size > 0
    ) {
      solutionImagePath = await uploadImage(
        solutionImageFile,
        "homepage/solutions",
      );
    }

    // Networking
    const networkingTitle = formData.get("networking[title]") || "";
    const networkingContent = formData.get("networking[content]") || "";
    const networkingTooltip1 = formData.get("networking[tooltip1]") || "";
    const networkingTooltip2 = formData.get("networking[tooltip2]") || "";
    const networkingTooltip3 = formData.get("networking[tooltip3]") || "";
    const networkingImageFile = formData.get("networkingImage");
    let networkingImagePath = homepage.networking?.image || "";
    if (
      networkingImageFile &&
      typeof networkingImageFile === "object" &&
      networkingImageFile.size > 0
    ) {
      networkingImagePath = await uploadImage(
        networkingImageFile,
        "homepage/networking",
      );
    }

    // Hero Banner Image
    const mainBannerFile = formData.get("mainBanner");
    let mainBannerPath = homepage.mainBanner || "";
    if (
      mainBannerFile &&
      typeof mainBannerFile === "object" &&
      mainBannerFile.size > 0
    ) {
      mainBannerPath = await uploadImage(mainBannerFile, "homepage/hero");
    }

    // Hero Video
    const heroVideoFile = formData.get("heroVideo");
    let heroVideoPath = homepage.heroVideo || "";
    if (
      heroVideoFile &&
      typeof heroVideoFile === "object" &&
      heroVideoFile.size > 0
    ) {
      heroVideoPath = await uploadImage(heroVideoFile, "homepage/hero", "public/assets", {
        maxSizeMB: 100,
        allowedTypes: [
          "video/mp4",
          "video/webm",
          "video/ogg",
          "video/quicktime",
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ],
      });
    }

    // Our Community Images (Array of new images + existing ones)
    // The frontend will pass new files as "communityImages"
    // and might pass a list of retained existing images as "existingCommunityImages"
    const newCommunityImages = formData.getAll("communityImages"); // files
    const retainedCommunityImages = formData.getAll("existingCommunityImages"); // strings

    let communityImagePaths = [...retainedCommunityImages];
    for (const file of newCommunityImages) {
      if (file && typeof file === "object" && file.size > 0) {
        const uploadedPath = await uploadImage(file, "homepage/community");
        communityImagePaths.push(uploadedPath);
      }
    }

    // Testimonials
    const testimonials = formData.getAll("testimonials");

    // Update payload
    homepage.heading = heading;
    homepage.subHeading = subHeading;
    homepage.mainBanner = mainBannerPath;
    homepage.heroVideo = heroVideoPath;
    homepage.presence = presence;
    homepage.activeCities = activeCities;
    homepage.activeSolutions = activeSolutions;
    homepage.features = features;
    homepage.solutionsForEveryone = {
      content: solutionContent,
      image: solutionImagePath,
    };
    homepage.networking = {
      title: networkingTitle,
      content: networkingContent,
      image: networkingImagePath,
      tooltips: [
        networkingTooltip1 || "", 
        networkingTooltip2 || "", 
        networkingTooltip3 || ""
      ],
    };
    homepage.ourCommunity = communityImagePaths;
    homepage.testimonials = testimonials;
    homepage.seo = {
      metaTitle: formData.get("seo[metaTitle]") || "",
      metaDescription: formData.get("seo[metaDescription]") || "",
      codeSnippet: formData.get("seo[codeSnippet]") || "",
    };

    await homepage.save();

    return NextResponse.json({
      success: true,
      data: homepage,
      message: "Homepage updated successfully",
    });
  } catch (error) {
    console.error("Homepage Update Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update homepage" },
      { status: 500 },
    );
  }
}
