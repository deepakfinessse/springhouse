import React from "react";
import Header from "@/app/components/home/Header";
import GlobalBanner from "@/app/components/home/GlobalBanner";
import CareerForm from "@/app/components/careers/CareerForm";
import Footer from "@/app/components/home/Footer";
import connectDB from "@/utils/db";
import FooterModel from "@/model/footer.model";
import { Homepage } from "@/model/homepage.model";

export async function generateMetadata() {
  await connectDB();
  const homepage = await Homepage.findOne({}).select("mainBanner").lean();
  const ogImage = homepage?.mainBanner || "";
  const title = "Careers at Spring House | Join Our Team";
  const description =
    "Explore career opportunities at Spring House. Join our team and be a part of creating exceptional coworking and managed workspace experiences.";
  return {
    title,
    description,
    alternates: {
      canonical: "https://springhouse.in/careers",
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: "https://springhouse.in/careers",
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

export const revalidate = 0;

export default async function CareersPage() {
  await connectDB();
  const footerData = (await FooterModel.findOne({}).lean()) || {};
  const careerFormImage = footerData?.formImages?.careerFormImage || "";
  const careerHeroBanner = footerData?.pageBanners?.careerHeroBanner || "/assets/bannerimage/1747035219_home-banner.jpg";

  return (
    <>
      <Header />
      <GlobalBanner
        title="Careers"
        imageSrc={careerHeroBanner}
      />
      <CareerForm careerFormImage={careerFormImage} />
      <Footer />
    </>
  );
}
