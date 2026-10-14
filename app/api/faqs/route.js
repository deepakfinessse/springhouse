import connectDB from "@/utils/db";
import { FAQ } from "@/model/faq.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const faqs = await FAQ.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: faqs });
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
    const body = await request.json();
    const faq = await FAQ.create(body);
    return NextResponse.json({ success: true, data: faq }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "FAQ ID is required" },
        { status: 400 },
      );
    }

    const faq = await FAQ.findByIdAndUpdate(_id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!faq) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: faq });
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
        { success: false, error: "FAQ ID is required" },
        { status: 400 },
      );
    }

    const deletedFaq = await FAQ.findByIdAndDelete(_id);

    if (!deletedFaq) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
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
