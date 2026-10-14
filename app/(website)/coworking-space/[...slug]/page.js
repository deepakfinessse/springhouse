import connectDB from "@/utils/db";
import { City } from "@/model/city.model";
import { Property } from "@/model/property.model";
import { Solution } from "@/model/solution.model";
import { Area } from "@/model/area.model";
import { Amenity } from "@/model/amenity.model";
import Header from "@/app/components/home/Header";
import Footer from "@/app/components/home/Footer";
import GlobalBanner from "@/app/components/home/GlobalBanner";
import LocationContentWrapper from "@/app/components/location/LocationContentWrapper";
import LocationAmenities from "@/app/components/location/LocationAmenities";
import SolutionsDesktop from "@/app/components/home/SolutionsDesktop";
import SolutionsMobile from "@/app/components/home/SolutionsMobile";
import OtherLocations from "@/app/components/location/OtherLocations";
import ContactForm from "@/app/components/home/ContactForm";
import PropertyHero from "@/app/components/property/PropertyHero";
import PropertyDescription from "@/app/components/property/PropertyDescription";
import PropertyAmenities from "@/app/components/property/PropertyAmenities";
import PropertySolutions from "@/app/components/property/PropertySolutions";
import PropertyLocationMap from "@/app/components/property/PropertyLocationMap";
import AvailableProperties from "@/app/components/solutions/AvailableProperties";
import FooterModel from "@/model/footer.model";
import { getDropdownOptions } from "@/utils/dropdowns";
import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import "@/app/components/property/property.css";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!slug || !Array.isArray(slug)) return { title: "Coworking Space" };
  
  await connectDB();

  if (slug.length === 1) {
    const citySlug = slug[0].replace("-coworking-space", "");
    const city = await City.findOne({ slug: citySlug, isActive: true }).lean();
    if (!city) return { title: "Coworking Space" };
    const title = city.seo?.metaTitle || `Managed Workspaces and Coworking Spaces in ${city.name}`;
    const description = city.seo?.metaDescription || `Find the perfect managed office or coworking space in ${city.name}. Spring House offers flexible workspace solutions.`;
    let ogImage = city.image || "";
    if (!ogImage) {
      const { Homepage } = await import("@/model/homepage.model");
      const homepage = await Homepage.findOne({}).select("mainBanner").lean();
      ogImage = homepage?.mainBanner || "";
    }
    return {
      title,
      description,
      alternates: {
        canonical: `https://springhouse.in/coworking-space/${city.slug}`,
      },
      openGraph: {
        type: "website",
        title,
        description,
        url: `https://springhouse.in/coworking-space/${city.slug}`,
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
  } else if (slug.length === 2) {
    const propertySlug = slug[1];
    const property = await Property.findOne({ slug: propertySlug, isActive: true })
      .populate("city", "slug")
      .lean();
    if (!property) return { title: "Property Not Found" };
    const title = property.seo?.metaTitle || `${property.name} | SpringHouse`;
    const description = property.seo?.metaDescription || property.description || "Discover premium managed workspaces.";
    let ogImage = property.images?.[0] || "";
    if (!ogImage) {
      const { Homepage } = await import("@/model/homepage.model");
      const homepage = await Homepage.findOne({}).select("mainBanner").lean();
      ogImage = homepage?.mainBanner || "";
    }
    return {
      title,
      description,
      alternates: {
        canonical: `https://springhouse.in/coworking-space/${property.city?.slug || slug[0]}/${property.slug}`,
      },
      openGraph: {
        type: "website",
        title,
        description,
        url: `https://springhouse.in/coworking-space/${property.city?.slug || slug[0]}/${property.slug}`,
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

export default async function CoworkingSpaceCatchAll({ params }) {
  const { slug } = await params;
  if (!slug || !Array.isArray(slug)) notFound();

  await connectDB();

  if (slug.length === 1) {
    // --- CITY PAGE LOGIC ---
    const citySlug = slug[0].replace("-coworking-space", "");
    const cityDataRaw = await City.findOne({ slug: citySlug }).populate("activeSolutions").lean();
    if (!cityDataRaw) notFound();

    const activeSolutionsRaw = await Solution.find({ isActive: true }).lean();
    const areasRaw = await Area.find({ city: cityDataRaw._id }).lean();
    const propertiesRaw = await Property.find({ city: cityDataRaw._id, isActive: true })
      .populate("city", "slug name")
      .populate("area", "slug name")
      .populate("activeSolutions", "slug name")
      .populate("amenities", "name featuredIcon")
      .lean();

    const amenityMap = new Map();
    propertiesRaw.forEach(prop => {
      prop.amenities?.forEach(amenity => {
        if (!amenityMap.has(amenity._id.toString())) {
          amenityMap.set(amenity._id.toString(), amenity);
        }
      });
    });
    const cityAmenities = Array.from(amenityMap.values());
    const otherCitiesRaw = await City.find({ slug: { $ne: citySlug }, isActive: true }).select("name slug").lean();

    const cityData = JSON.parse(JSON.stringify(cityDataRaw));
    const activeSolutions = JSON.parse(JSON.stringify(activeSolutionsRaw));
    const areas = JSON.parse(JSON.stringify(areasRaw));
    const cityProperties = JSON.parse(JSON.stringify(propertiesRaw));
    const otherCities = JSON.parse(JSON.stringify(otherCitiesRaw));
    const citySpecificSolutions = cityData?.activeSolutions || [];

    const dropdownOptions = await getDropdownOptions();
    const footerData = (await FooterModel.findOne({}).lean()) || {};
    const phone = footerData?.contactInfo?.phone || "";

    return (
      <>
        <Header />
        <GlobalBanner title={cityData.name} imageSrc={cityData.image} />
        <LocationContentWrapper city={cityData} cityProperties={cityProperties} activeSolutions={activeSolutions} areas={areas} />
        <LocationAmenities amenities={cityAmenities} />
        <SolutionsDesktop data={citySpecificSolutions} />
        <SolutionsMobile data={citySpecificSolutions} />
        <OtherLocations cities={otherCities} />
        <ContactForm 
          phone={phone} 
          dropdownOptions={dropdownOptions} 
          contactFormImage={footerData?.formImages?.contactFormImage} 
        />
        {cityData.seo?.codeSnippet && (
          <div dangerouslySetInnerHTML={{ __html: cityData.seo.codeSnippet }} />
        )}
        <Footer />
      </>
    );
  } else if (slug.length === 2) {
    // --- PROPERTY PAGE LOGIC ---
    const [locationSlug, propertySlug] = slug;
    
    // locationSlug might be 'gurugram' or 'gurugram-coworking-space'
    const cleanLocationSlug = locationSlug.replace("-coworking-space", "");

    const rawProperty = await Property.findOne({ slug: propertySlug, isActive: true })
      .populate("city", "name slug")
      .populate("area", "name slug")
      .populate("activeSolutions", "name slug image")
      .populate("amenities", "name featuredIcon")
      .lean();

    if (!rawProperty) notFound();
    
    // Verify that the location matches the property's city slug
    if (rawProperty.city?.slug !== cleanLocationSlug) {
      notFound();
    }

    // Fetch same-area properties first (excluding current property)
    const sameAreaProps = rawProperty.area
      ? await Property.find({ area: rawProperty.area._id, _id: { $ne: rawProperty._id }, isActive: true })
          .populate("city", "name slug").populate("area", "name slug").populate("activeSolutions", "name slug").limit(4).lean()
      : [];

    let limitedRelated = [...sameAreaProps];

    // If fewer than 4, fill from same city (different area)
    if (limitedRelated.length < 4) {
      const excludeIds = [rawProperty._id, ...limitedRelated.map(p => p._id)];
      const remaining = 4 - limitedRelated.length;
      const sameCityProps = await Property.find({
        city: rawProperty.city._id,
        _id: { $nin: excludeIds },
        isActive: true,
      })
        .populate("city", "name slug").populate("area", "name slug").populate("activeSolutions", "name slug")
        .limit(remaining).lean();
      limitedRelated = [...limitedRelated, ...sameCityProps];
    }

    // Build "See More" link to city page's area section
    const areaSlug = rawProperty.area?.slug || rawProperty.area?._id || "";
    const seeMoreLink = `/coworking-space/${rawProperty.city.slug}`;

    const rawOtherCities = await City.find({ _id: { $ne: rawProperty.city._id }, isActive: true }).select("name slug").lean();
    
    const footerData = (await FooterModel.findOne({}).lean()) || {};
    const phone = footerData?.contactInfo?.phone || "";
    const dropdownOptions = await getDropdownOptions();

    const property = JSON.parse(JSON.stringify(rawProperty));
    const relatedProperties = JSON.parse(JSON.stringify(limitedRelated));
    const otherCities = JSON.parse(JSON.stringify(rawOtherCities));

    return (
      <>
        <Header />
        <PropertyHero property={property} />
        <PropertyDescription property={property} phone={phone} dropdownOptions={dropdownOptions} />
        <PropertyAmenities amenities={property.amenities} />
        <PropertySolutions activeSolutions={property.activeSolutions} />
        <PropertyLocationMap locationOnMap={property.locationOnMap} />
        <AvailableProperties properties={relatedProperties} maxCards={4} seeMoreLink={seeMoreLink} />
        
        <section className="specfic-prop amenities pt60 pb60">
          <div className="container-fluid">
            <div className="row mb-4"><div className="col-lg-6 col-12"><span className="section-title-span">Other locations</span></div></div>
            <div className="row">
              {otherCities.map((city) => (
                <div key={city.slug} className="col-md-6 col-6">
                  <div className="box-loc mb-lg-0 mb-md-0 mb-3">
                    <Link href={`/coworking-space/${city.slug}`}>{city.name}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {property.seo?.codeSnippet && (
          <div dangerouslySetInnerHTML={{ __html: property.seo.codeSnippet }} />
        )}
        <Footer />
      </>
    );
  }
  notFound();
}
