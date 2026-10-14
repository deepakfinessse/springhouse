import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Solution } from "@/model/solution.model";
import { Testimonial } from "@/model/testimonial.model";
import { uploadImage } from "@/utils/upload";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // Use findById directly
    // Using simple query instead of finding by ID from params inside try block
    // Await params if needed in newer nextjs, but params is usually object here in this version context?
    // Wait, in Next.js 15+ params is a promise. In 14 it's object.
    // Safest to access it directly if we know version, or await it if unsure.
    // Given previous code usage: const { id } = params; seems standard for 13/14.

    const solution = await Solution.findById(id).populate("testimonials"); // Potentially populate

    if (!solution) {
      return NextResponse.json(
        { success: false, error: "Solution not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: solution });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch solution" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const formData = await request.formData();

    const existingSolution = await Solution.findById(id);
    if (!existingSolution) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 },
      );
    }

    // Basic Fields
    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const isActive = formData.get("isActive") === "true";

    // Arrays - if sent. If empty, it might mean clear them or not sent?
    // Usually formData.getAll returns empty array if not present.
    // We should be careful about partial updates vs full form submission.
    // Assuming full form submission for simplicity.
    const fourPoints = formData.getAll("fourPoints");
    const testimonials = formData.getAll("testimonials");

    // Single Image
    const imageFile = formData.get("image");
    let imagePath = existingSolution.image;

    // If string is passed, it means keep existing (or it's the url).
    // If file is passed, upload.
    // Checking if it's a File object (has size/name) or string.
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      imagePath = await uploadImage(imageFile, "solutions");
    } else if (imageFile === "") {
      // If explicitly empty string, maybe delete? Or just keep existing if Logic implies.
      // Usually UI sends existing URL string if unchanged.
    }

    // Company Images (structured: backgroundImage, logo, link)
    const newCompanyImages = [];
    let ci = 0;
    while (
      formData.has(`companyImages[${ci}][backgroundImage]`) ||
      formData.has(`companyImages[${ci}][link]`)
    ) {
      const bgInput = formData.get(`companyImages[${ci}][backgroundImage]`);
      const logoInput = formData.get(`companyImages[${ci}][logo]`);
      const link = formData.get(`companyImages[${ci}][link]`) || "";

      let backgroundImage = "";
      if (typeof bgInput === "string") {
        backgroundImage = bgInput;
      } else if (bgInput && typeof bgInput === "object" && bgInput.size > 0) {
        backgroundImage = await uploadImage(bgInput, "solutions/company");
      }

      let logo = "";
      if (typeof logoInput === "string") {
        logo = logoInput;
      } else if (logoInput && typeof logoInput === "object" && logoInput.size > 0) {
        logo = await uploadImage(logoInput, "solutions/company");
      }

      newCompanyImages.push({ backgroundImage, logo, link });
      ci++;
    }

    // Featured Spaces
    // existing: featuredSpaces[0][image] = "url"
    // new: featuredSpaces[1][image] = File
    const featuredSpaces = [];
    let i = 0;
    while (formData.has(`featuredSpaces[${i}][name]`)) {
      const spaceName = formData.get(`featuredSpaces[${i}][name]`);
      const spaceInput = formData.get(`featuredSpaces[${i}][image]`);

      let spaceImagePath = "";

      // If we are editing, we might need to find the old image path from existing document
      // if the frontend doesn't send the old URL.
      // But ideally frontend sends the URL in the input if unchanged.

      if (typeof spaceInput === "string") {
        spaceImagePath = spaceInput;
      } else if (
        spaceInput &&
        typeof spaceInput === "object" &&
        spaceInput.size > 0
      ) {
        spaceImagePath = await uploadImage(spaceInput, "solutions/spaces");
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

    const updatePayload = {
      name,
      description,
      image: imagePath,
      fourPoints,
      testimonials,
      companyImages: newCompanyImages,
      featuredSpaces,
      visibleSections: hasVisibleSectionsUpdate ? visibleSections : existingSolution.visibleSections,
      isActive,
      seo: {
        metaTitle: formData.get("seo[metaTitle]"),
        metaDescription: formData.get("seo[metaDescription]"),
        codeSnippet: formData.get("seo[codeSnippet]"),
      },
    };

    if (slug && slug !== existingSolution.slug) {
      updatePayload.slug = slug;
    }

    const updatedSolution = await Solution.findByIdAndUpdate(
      id,
      updatePayload,
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json({
      success: true,
      data: updatedSolution,
      message: "Solution updated successfully",
    });
  } catch (error) {
    console.error("Update Solution Error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Solution.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Solution not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Solution deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete solution" },
      { status: 500 },
    );
  }
}
