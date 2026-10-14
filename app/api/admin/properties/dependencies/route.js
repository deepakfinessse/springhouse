import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { City } from "@/model/city.model";
import { Area } from "@/model/area.model";
import { Amenity } from "@/model/amenity.model";
import { Solution } from "@/model/solution.model";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const [cities, areas, amenities, solutions] = await Promise.all([
      City.find({ isActive: true }).select("name _id").sort({ name: 1 }),
      Area.find().select("name _id city").sort({ name: 1 }),
      Amenity.find().select("name _id").sort({ name: 1 }),
      Solution.find({ isActive: true }).select("name _id").sort({ name: 1 }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        cities,
        areas,
        amenities,
        solutions,
      },
    });
  } catch (error) {
    console.error("Dependencies fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dependencies" },
      { status: 500 },
    );
  }
}
