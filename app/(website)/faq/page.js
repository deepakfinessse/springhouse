import React from "react";
import Header from "@/app/components/home/Header";
import Footer from "@/app/components/home/Footer";
import FaqHero from "@/app/components/faq/FaqHero";
import FaqAccordion from "@/app/components/faq/FaqAccordion";
import connectDB from "@/utils/db";
import { FAQ } from "@/model/faq.model";

export async function generateMetadata() {
  await connectDB();
  const faqWithSeo = await FAQ.findOne({
    "seo.metaTitle": { $exists: true, $ne: "" },
  }).lean();

  const { Homepage } = await import("@/model/homepage.model");
  const homepage = await Homepage.findOne({}).select("mainBanner").lean();
  const ogImage = homepage?.mainBanner || "";

  const title = faqWithSeo?.seo?.metaTitle || "Frequently Asked Questions | SpringHouse";
  const description =
    faqWithSeo?.seo?.metaDescription ||
    "Got questions? We have answers. Find everything you need to know about SpringHouse coworking, access, billing, and solutions.";

  return {
    title,
    description,
    alternates: {
      canonical: "https://springhouse.in/faq",
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: "https://springhouse.in/faq",
      siteName: "SpringHouse",
      images: ogImage ? [{ url: ogImage, alt: title }] : [],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function FAQRoutePage() {
  await connectDB();

  // Fetch active FAQs sorted by creation date
  const rawFaqs = await FAQ.find({}).sort({ createdAt: 1 }).lean();

  // Get SEO codeSnippet from the first FAQ document that has it
  const faqWithSnippet = rawFaqs.find((f) => f.seo?.codeSnippet);
  const seoCodeSnippet = faqWithSnippet?.seo?.codeSnippet || "";

  // Safely serialize Mongoose ObjectIDs for Next.js Client Component props
  const serializedFaqs = rawFaqs.map((section) => ({
    ...section,
    _id: section._id.toString(),
    questions: (section.questions || []).map((q) => ({
      ...q,
      _id: q._id.toString(),
    })),
  }));

  return (
    <>
      <Header />

      <FaqHero />
      <FaqAccordion faqData={serializedFaqs} />

      {seoCodeSnippet && (
        <div dangerouslySetInnerHTML={{ __html: seoCodeSnippet }} />
      )}
      <Footer />
    </>
  );
}
