import Header from "@/app/components/home/Header";
import HeroBanner from "@/app/components/home/HeroBanner";
import PresenceCounter from "@/app/components/home/PresenceCounter";
import SolutionsDesktop from "@/app/components/home/SolutionsDesktop";
import SolutionsMobile from "@/app/components/home/SolutionsMobile";
import LocationCards from "@/app/components/home/LocationCards";
import DesignYourIdealWorkNest from "@/app/components/home/DesignYourIdealWorkNest";

import OurCommunity from "@/app/components/home/OurCommunity";
import Networking from "@/app/components/home/Networking";
import Testimonials from "@/app/components/home/Testimonials";
import Blogs from "@/app/components/home/Blogs";
import ContactForm from "@/app/components/home/ContactForm";
import Footer from "@/app/components/home/Footer";
import FooterModel from "@/model/footer.model";
import { Homepage } from "@/model/homepage.model";
import { Property } from "@/model/property.model";
import { City } from "@/model/city.model";
import { Testimonial } from "@/model/testimonial.model";
import { Solution } from "@/model/solution.model";
import { Blog } from "@/model/blog.model";
import connectDB from "@/utils/db";
import { getDropdownOptions } from "@/utils/dropdowns";
export const revalidate = 0;

export async function generateMetadata() {
  await connectDB();
  const homepage = await Homepage.findOne({}).lean();
  const title = homepage?.seo?.metaTitle || "SpringHouse Coworking | Managed Office Spaces";
  const description = homepage?.seo?.metaDescription || "Find premium managed office and coworking spaces with SpringHouse.";
  const ogImage = homepage?.mainBanner || "";
  return {
    title,
    description,
    alternates: {
      canonical: "https://springhouse.in",
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: "https://springhouse.in",
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

export default async function Home() {
  await connectDB();
  const footerData = (await FooterModel.findOne({}).lean()) || {};
  const phone = footerData?.contactInfo?.phone || "";
  const dropdownOptions = await getDropdownOptions();
  const blogsData = await Blog.find({ isActive: true })
    .sort({ publishDate: -1, createdAt: -1 })
    .limit(4)
    .lean();

  // Fetch Homepage Data and populate references
  const homepageData =
    (await Homepage.findOne({})
      .populate({
        path: "activeCities",
        model: City,
      })
      .populate({
        path: "activeSolutions",
        model: Solution,
      })
      .populate({
        path: "testimonials",
        model: Testimonial,
      })
      .lean()) || {};

  // Calculate center numbers for active cities
  let enrichedCities = [];
  if (homepageData.activeCities && homepageData.activeCities.length > 0) {
    const cityIds = homepageData.activeCities.map((c) => c._id);
    const properties = await Property.find({
      city: { $in: cityIds },
      isActive: true,
    }).lean();

    enrichedCities = homepageData.activeCities.map((city) => {
      const propertyCount = properties.filter(
        (p) => p.city && p.city.toString() === city._id.toString(),
      ).length;
      return { ...city, propertyCount };
    });
  }

  // Override activeCities with enriched versions
  if (homepageData.activeCities) {
    homepageData.activeCities = enrichedCities;
  }

  const safeData = JSON.parse(JSON.stringify(homepageData));
  const safeSolutions = JSON.parse(JSON.stringify(homepageData.activeSolutions || []));
  const safeBlogs = JSON.parse(JSON.stringify(blogsData));
  const seoCodeSnippet = homepageData?.seo?.codeSnippet || "";

  return (
    <>
      <Header />
      <HeroBanner
        dropdownOptions={dropdownOptions}
        data={{
          mainBanner: safeData.mainBanner,
          heroVideo: safeData.heroVideo,
          heading: safeData.heading,
          subHeading: safeData.subHeading,
        }}
      />
      <PresenceCounter data={safeData.presence} />
      <LocationCards data={safeData.activeCities} />
      <DesignYourIdealWorkNest data={safeData.features} />

      <SolutionsDesktop data={safeSolutions} />
      <SolutionsMobile data={safeSolutions} />
      <Networking data={safeData.networking} />
      <OurCommunity data={safeData.ourCommunity} />
      <Testimonials data={safeData.testimonials} />
      <Blogs data={safeBlogs} />
      <ContactForm phone={phone} dropdownOptions={dropdownOptions} contactFormImage={footerData?.formImages?.contactFormImage || ""} />
      {seoCodeSnippet && (
        <div dangerouslySetInnerHTML={{ __html: seoCodeSnippet }} />
      )}
      <Footer />
    </>
  );
}
