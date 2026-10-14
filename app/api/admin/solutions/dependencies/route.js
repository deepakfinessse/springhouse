import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Testimonial } from "@/model/testimonial.model";

export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({})
      .select("clientName _id")
      .lean();
    return NextResponse.json({ success: true, data: { testimonials } });
  } catch (error) {
    console.error("Dependencies Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dependencies" },
      { status: 500 },
    );
  }
}
