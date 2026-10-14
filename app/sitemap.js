import connectDB from "@/utils/db";
import { Solution } from "@/model/solution.model";
import { Blog } from "@/model/blog.model";
import { City } from "@/model/city.model";
import { Property } from "@/model/property.model";
import { OtherPage } from "@/model/otherPage.model";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = "https://springhouse.in";

  try {
    await connectDB();

    // Static Routes
    const staticRoutes = [
      "",
      "/about-us",
      "/blogs",
      "/careers",
      "/faq",
      "/pr",
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: route === "" ? 1 : 0.8,
    }));

    // Solutions
    const solutions = await Solution.find({ isActive: true })
      .select("slug updatedAt")
      .lean();

    const solutionRoutes = solutions.map((s) => ({
      url: `${baseUrl}/${s.slug}`,
      lastModified: s.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    // Blogs
    const blogs = await Blog.find({ isActive: true })
      .select("slug updatedAt")
      .lean();

    const blogRoutes = blogs.map((b) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: b.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    // Other Pages
    const otherPages = await OtherPage.find({ isActive: true })
      .select("slug updatedAt")
      .lean();

    const otherPageRoutes = otherPages.map((p) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    // Cities
    const cities = await City.find({ isActive: true })
      .select("slug updatedAt")
      .lean();

    const cityRoutes = cities.map((c) => ({
      url: `${baseUrl}/coworking-space/${c.slug}`,
      lastModified: c.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Properties
    const properties = await Property.find({ isActive: true })
      .populate("city", "slug")
      .select("slug city updatedAt")
      .lean();

    const propertyRoutes = properties
      .filter((p) => p.city?.slug)
      .map((p) => ({
        url: `${baseUrl}/coworking-space/${p.city.slug}/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      }));

    return [
      ...staticRoutes,
      ...solutionRoutes,
      ...blogRoutes,
      ...otherPageRoutes,
      ...cityRoutes,
      ...propertyRoutes,
    ];
  } catch (error) {
    console.error("Sitemap Error:", error);

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
    ];
  }
}