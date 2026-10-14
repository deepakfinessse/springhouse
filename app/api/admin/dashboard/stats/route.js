import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import { Property } from "@/model/property.model";
import { City } from "@/model/city.model";
import { Area } from "@/model/area.model";
import { Enquiry } from "@/model/enquiry.model";

export async function GET() {
  try {
    await connectDB();

    const [
      propertyCount,
      cityCount,
      areaCount,
      unreadEnquiryCount,
      totalEnquiryCount,
      citiesWithCounts,
      solutionsWithCounts,
    ] = await Promise.all([
      Property.countDocuments(),
      City.countDocuments(),
      Area.countDocuments(),
      Enquiry.countDocuments({ isRead: false }),
      Enquiry.countDocuments(),
      // Properties by City
      Property.aggregate([
        { $group: { _id: "$city", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "cities",
            localField: "_id",
            foreignField: "_id",
            as: "cityInfo",
          },
        },
        { $unwind: "$cityInfo" },
        { $project: { name: "$cityInfo.name", value: "$count" } },
      ]),
      // Properties by Solution
      Property.aggregate([
        { $unwind: "$activeSolutions" },
        { $group: { _id: "$activeSolutions", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "solutions",
            localField: "_id",
            foreignField: "_id",
            as: "solutionInfo",
          },
        },
        { $unwind: "$solutionInfo" },
        { $project: { name: "$solutionInfo.name", value: "$count" } },
      ]),
    ]);

    // To ensure all cities/solutions are represented (even those with 0 properties),
    // we could fetch all and merge, but for a dashboard, showing active ones is usually enough.
    // However, to match previous behavior, we'll return these distributions.

    return NextResponse.json({
      success: true,
      data: {
        properties: propertyCount,
        cities: cityCount,
        areas: areaCount,
        enquiries: unreadEnquiryCount,
        charts: {
          citiesData: citiesWithCounts,
          solutionsData: solutionsWithCounts,
          enquiriesData: {
            read: totalEnquiryCount - unreadEnquiryCount,
            unread: unreadEnquiryCount,
          },
        },
      },
    });
  } catch (error) {
    console.error("Dashboard stats fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
