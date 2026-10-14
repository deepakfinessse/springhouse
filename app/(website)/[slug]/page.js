import React from "react";
import { notFound } from "next/navigation";
import connectDB from "@/utils/db";
import { Solution } from "@/model/solution.model";
import { Testimonial } from "@/model/testimonial.model";
import { City } from "@/model/city.model";
import { OtherPage } from "@/model/otherPage.model";
import { Property } from "@/model/property.model";
import { Homepage } from "@/model/homepage.model";
import FooterModel from "@/model/footer.model";

import Header from "@/app/components/home/Header";
import Footer from "@/app/components/home/Footer";
import ContactForm from "@/app/components/home/ContactForm";
import Testimonials from "@/app/components/home/Testimonials";
import AvailableProperties from "@/app/components/solutions/AvailableProperties";
import OtherSolutions from "@/app/components/solutions/OtherSolutions";
import OurCommunity from "@/app/components/home/OurCommunity";
import Networking from "@/app/components/home/Networking";
import GlobalBanner from "@/app/components/home/GlobalBanner";
import SolutionIntro from "@/app/components/solutions/SolutionIntro";
import FullHouse from "@/app/components/solutions/FullHouse";
import SpacesAvailable from "@/app/components/solutions/SpacesAvailable";
import { getDropdownOptions } from "@/utils/dropdowns";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();

  // Try Solution first
  const solution = await Solution.findOne({ slug, isActive: true }).lean();
  if (solution) {
    const title = solution.seo?.metaTitle || `${solution.name} | SpringHouse`;
    const description = solution.seo?.metaDescription || solution.description;
    const ogImage = solution.image || "";
    return {
      title,
      description,
      alternates: {
        canonical: `https://springhouse.in/${slug}`,
      },
      openGraph: {
        type: "website",
        title,
        description,
        url: `https://springhouse.in/${slug}`,
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

  // Then try OtherPage
  const page = await OtherPage.findOne({ slug, isActive: true }).lean();
  if (page) {
    const title = page.seo?.metaTitle || page.name || "Spring House";
    const description = page.seo?.metaDescription || "";
    const { Homepage } = await import("@/model/homepage.model");
    const homepage = await Homepage.findOne({}).select("mainBanner").lean();
    const ogImage = homepage?.mainBanner || "";
    return {
      title,
      description,
      alternates: {
        canonical: `https://springhouse.in/${slug}`,
      },
      openGraph: {
        type: "website",
        title,
        description,
        url: `https://springhouse.in/${slug}`,
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

  return { title: "Page Not Found" };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  await connectDB();

  // 1. Try to find a Solution
  const rawSolution = await Solution.findOne({ slug, isActive: true })
    .populate("testimonials")
    .lean();

  if (rawSolution) {
    const solution = JSON.parse(JSON.stringify(rawSolution));
    const description = solution.description?.split("\r\n").filter(Boolean) || [];
    const vs = solution.visibleSections || [];
    const show = (key) => vs.length === 0 || vs.includes(key);

    // Fetch properties where this solution is active
    const rawProperties = await Property.find({
      activeSolutions: rawSolution._id,
      isActive: true,
    })
      .populate("city")
      .lean();
      
    const solutionProperties = JSON.parse(JSON.stringify(rawProperties));

    // For ContactForm dynamic image
    const footerData = (await FooterModel.findOne({}).lean()) || {};

    // Fetch Global Homepage Data for Community and Networking
    const homepageData = (await Homepage.findOne({}).lean()) || {};

    const dropdownOptions = await getDropdownOptions();


    return (
      <>
        <Header />
        <GlobalBanner title={solution.name} imageSrc={solution.image} />
        
        {show("intro") && (
          <SolutionIntro description={description} fourPoints={solution.fourPoints} />
        )}
        
        {show("testimonials") && solution.testimonials && solution.testimonials.length > 0 && (
          <Testimonials data={solution.testimonials} />
        )}

        {show("companyImages") && solution.companyImages && solution.companyImages.length > 0 && (
          <FullHouse images={solution.companyImages} />
        )}

        {show("featuredSpaces") && solution.featuredSpaces && solution.featuredSpaces.length > 0 && (
          <SpacesAvailable spaces={solution.featuredSpaces} />
        )}

        {show("availableProperties") && solutionProperties && solutionProperties.length > 0 && (
          <AvailableProperties properties={solutionProperties} showTabs={true} />
        )}

        {show("ourCommunity") && homepageData.ourCommunity && homepageData.ourCommunity.length > 0 && (
          <OurCommunity data={homepageData.ourCommunity} />
        )}

        {show("networking") && homepageData.networking && (homepageData.networking.title || homepageData.networking.content) && (
          <Networking data={homepageData.networking} />
        )}

        {show("otherSolutions") && <OtherSolutions />}
        
        {show("contactForm") && (
          <ContactForm 
            phone={footerData?.contactInfo?.phone} 
            dropdownOptions={dropdownOptions}
            contactFormImage={footerData?.formImages?.contactFormImage} 
          />
        )}
        {solution.seo?.codeSnippet && (
          <div dangerouslySetInnerHTML={{ __html: solution.seo.codeSnippet }} />
        )}
        <Footer />
      </>
    );
  }

  // 2. Try to find an OtherPage
  const page = await OtherPage.findOne({ slug, isActive: true }).lean();
  if (page) {
    return (
      <>
        <Header />
        <GlobalBanner
          title={page.name}
          imageSrc="/assets/bannerimage/1747035219_home-banner.jpg"
        />
        <section className="ptb60" data-aos="fade-up">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div
                  className="rich-text-content ql-content"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>
            </div>
          </div>
        </section>
        {page.seo?.codeSnippet && (
          <div dangerouslySetInnerHTML={{ __html: page.seo.codeSnippet }} />
        )}
        <Footer />
      </>
    );
  }

  // 3. Neither found
  notFound();
}
