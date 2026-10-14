import connectDB from "@/utils/db";
import { City } from "@/model/city.model";
import { Property } from "@/model/property.model";
import { Solution } from "@/model/solution.model";

/**
 * Server-side helper function to fetch dropdown options for client-side forms.
 * Returns only active records mapping to minimal data structures.
 */
export async function getDropdownOptions() {
  try {
    await connectDB();

    const [cities, properties, solutions] = await Promise.all([
      City.find({ isActive: true })
        .select("_id name slug")
        .sort({ name: 1 })
        .lean(),
      Property.find({ isActive: true })
        .select("_id name slug city activeSolutions")
        .populate("city", "slug name")
        .populate("activeSolutions", "_id name slug")
        .sort({ name: 1 })
        .lean(),
      Solution.find({ isActive: true })
        .select("_id name slug")
        .sort({ name: 1 })
        .lean(),
    ]);

    // Standardize object _id casting (lean payload must strip binary Mongo objects)
    const secureJSON = (arr) =>
      arr.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
        city: doc.city ? { ...doc.city, _id: doc.city._id.toString() } : null,
        activeSolutions: Array.isArray(doc.activeSolutions)
          ? doc.activeSolutions.map((s) => ({
              ...s,
              _id: s._id.toString(),
            }))
          : [],
      }));

    return {
      cities: secureJSON(cities),
      properties: secureJSON(properties),
      solutions: secureJSON(solutions),
    };
  } catch (error) {
    console.error("Error fetching dropdown options from DB:", error);
    return {
      cities: [],
      properties: [],
      solutions: [],
    };
  }
}
