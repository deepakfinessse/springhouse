import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { SolutionsPage } from "@/model/solutionsPage.model";

export async function GET() {
  try {
    await connectDB();
    let solutionsPage = await SolutionsPage.findOne();

    if (!solutionsPage) {
      solutionsPage = await SolutionsPage.create({
        activeSolutions: [],
      });
    }

    return NextResponse.json({ success: true, data: solutionsPage });
  } catch (error) {
    console.error("Solutions Page Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch solutions page data" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const formData = await request.formData();

    let solutionsPage = await SolutionsPage.findOne();
    if (!solutionsPage) {
      solutionsPage = await SolutionsPage.create({});
    }

    const title = formData.get("title");
    const description = formData.get("description");
    const activeSolutions = formData.getAll("activeSolutions");

    solutionsPage.title = title || "";
    solutionsPage.description = description || "";
    solutionsPage.activeSolutions = activeSolutions;
    solutionsPage.seo = {
      metaTitle: formData.get("seo[metaTitle]") || "",
      metaDescription: formData.get("seo[metaDescription]") || "",
      codeSnippet: formData.get("seo[codeSnippet]") || "",
    };

    await solutionsPage.save();

    return NextResponse.json({
      success: true,
      data: solutionsPage,
      message: "Solutions page updated successfully",
    });
  } catch (error) {
    console.error("Solutions Page Update Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update solutions page" },
      { status: 500 },
    );
  }
}
