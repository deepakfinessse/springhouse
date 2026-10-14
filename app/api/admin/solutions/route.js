import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Solution } from "@/model/solution.model";
import { uploadImage } from "@/utils/upload";

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();

    // Basic Fields
    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const isActive = formData.get("isActive") === "true";

    // Arrays
    const fourPoints = formData.getAll("fourPoints");
    const testimonials = formData.getAll("testimonials");

    // Single Image (Featured)
    const imageFile = formData.get("image");
    let imagePath = "";
    if (imageFile && imageFile.size > 0) {
      imagePath = await uploadImage(imageFile, "solutions");
    }

    // Company Images (structured: [{backgroundImage, logo, link}])
    const companyImages = [];
    let ci = 0;
    while (
      formData.has(`companyImages[${ci}][backgroundImage]`) ||
      formData.has(`companyImages[${ci}][link]`)
    ) {
      const bgInput = formData.get(`companyImages[${ci}][backgroundImage]`);
      const logoInput = formData.get(`companyImages[${ci}][logo]`);
      const link = formData.get(`companyImages[${ci}][link]`) || "";

      let backgroundImage = "";
      if (bgInput && typeof bgInput === "object" && bgInput.size > 0) {
        backgroundImage = await uploadImage(bgInput, "solutions/company");
      } else if (typeof bgInput === "string") {
        backgroundImage = bgInput;
      }

      let logo = "";
      if (logoInput && typeof logoInput === "object" && logoInput.size > 0) {
        logo = await uploadImage(logoInput, "solutions/company");
      } else if (typeof logoInput === "string") {
        logo = logoInput;
      }

      companyImages.push({ backgroundImage, logo, link });
      ci++;
    }

    // Featured Spaces (Complex Array: [{name, image}])
    // Expecting formData keys: featuredSpaces[0][name], featuredSpaces[0][image]
    const featuredSpaces = [];
    let i = 0;
    while (formData.has(`featuredSpaces[${i}][name]`)) {
      const spaceName = formData.get(`featuredSpaces[${i}][name]`);
      const spaceImageFile = formData.get(`featuredSpaces[${i}][image]`);

      let spaceImagePath = "";
      if (spaceImageFile && spaceImageFile.size > 0) {
        spaceImagePath = await uploadImage(spaceImageFile, "solutions/spaces");
      }

      featuredSpaces.push({
        name: spaceName,
        image: spaceImagePath,
      });
      i++;
    }

    // Visible Sections
    const hasVisibleSectionsUpdate = formData.has("visibleSectionsUpdate");
    const visibleSections = formData.getAll("visibleSections");

    const payload = {
      name,
      slug: slug || undefined,
      description,
      image: imagePath,
      fourPoints,
      testimonials,
      companyImages,
      featuredSpaces,
      visibleSections: hasVisibleSectionsUpdate ? visibleSections : undefined,
      isActive,
      seo: {
        metaTitle: formData.get("seo[metaTitle]"),
        metaDescription: formData.get("seo[metaDescription]"),
        codeSnippet: formData.get("seo[codeSnippet]"),
      },
    };

    const newSolution = await Solution.create(payload);

    return NextResponse.json({
      success: true,
      data: newSolution,
      message: "Solution created successfully",
    });
  } catch (error) {
    console.error("Create Solution Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create solution" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const [solutions, total] = await Promise.all([
      Solution.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Solution.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: solutions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Solutions fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch solutions" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "No solution IDs provided" },
        { status: 400 },
      );
    }

    await Solution.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: "Solutions deleted successfully",
    });
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete solutions" },
      { status: 500 },
    );
  }
}
