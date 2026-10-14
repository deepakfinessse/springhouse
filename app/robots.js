import { NextResponse } from "next/server";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/login/"],
      },
    ],
    sitemap: "https://springhouse.in/sitemap.xml",
  };
}
