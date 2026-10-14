import connectDB from "@/utils/db";
import { Solution } from "@/model/solution.model";
import { SolutionsPage as SolutionsPageModel } from "@/model/solutionsPage.model";
import { City } from "@/model/city.model";
import FooterModel from "@/model/footer.model";
import { getDropdownOptions } from "@/utils/dropdowns";
import Link from "next/link";
import Header from "@/app/components/home/Header";
import Footer from "@/app/components/home/Footer";
import ContactForm from "@/app/components/home/ContactForm";

export const revalidate = 0;

export async function generateMetadata() {
  await connectDB();
  const pageData = await SolutionsPageModel.findOne().lean();

  return {
    title: pageData?.seo?.metaTitle || "Solutions | SpringHouse Coworking",
    description: pageData?.seo?.metaDescription || "Explore premium managed office and coworking space solutions with SpringHouse.",
  };
}

export default async function SolutionsPage() {
  await connectDB();
  const pageData = await SolutionsPageModel.findOne().lean();
  let solutions = [];

  if (pageData && pageData.activeSolutions && pageData.activeSolutions.length > 0) {
    // Fetch only the selected solutions
    solutions = await Solution.find({ _id: { $in: pageData.activeSolutions }, isActive: true }).lean();
    // Maintain the order of activeSolutions array if desired, or sort them by createdAt
    // Let's sort them as per the array provided
    const sortedSolutions = [];
    pageData.activeSolutions.forEach(id => {
      const sol = solutions.find(s => s._id.toString() === id.toString());
      if (sol) sortedSolutions.push(sol);
    });
    solutions = sortedSolutions;
  } else {
    // Fallback if none selected or no pageData exists
    solutions = await Solution.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  }

  const cities = await City.find({ isActive: true }).sort({ createdAt: -1 }).lean();

  const footerData = (await FooterModel.findOne({}).lean()) || {};
  const phone = footerData?.contactInfo?.phone || "";
  const dropdownOptions = await getDropdownOptions();

  return (
    <>
      <Header />
      <style dangerouslySetInnerHTML={{
        __html: `
        .s-p {
          margin-top: 0px;
        }
        .service-card {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
        }
        .service-section {
          padding-top: 50px;
          padding-bottom: 20px;
        }
      `}} />

      <section className="virtual-guru pt-5 solution-page">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-12 mb-4">
              {pageData?.title && (
                <h1 className="mb-3" dangerouslySetInnerHTML={{ __html: pageData.title }}></h1>
              )}
              {pageData?.description && (
                <div dangerouslySetInnerHTML={{ __html: pageData.description.replace(/\n/g, "<br/>") }}></div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="service-section">
        <div className="container-fluid">
          <div className="row mb-4">
            <div className="col-lg-12">
              <span className="section-title-span" style={{ paddingLeft: 0, display: "inline-block", marginBottom: "30px" }}>solutions for everyone</span>
            </div>
          </div>

          <div className="row">
            {solutions.map((solution, index) => (
              <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={solution._id || index}>
                <div className="service-card relative">
                  <div className="service-img">
                    <img src={solution.image || "https://springgreen-bison-121842.hostingersite.com/assets/officedetails/1747049618_j2.png"} alt={solution.name} />
                    <div className="shape-bottom">
                      <div className="shape-left-top">
                        <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-11 h-11" style={{ width: "1.0rem", height: "1.0rem", stroke: "#f5f3f3" }}>
                          <path d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z" fill="#f5f3f3"></path>
                        </svg>
                      </div>
                      <div className="shape-right-bottom">
                        <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-11 h-11" style={{ width: "1.0rem", height: "1.0rem", stroke: "#f5f3f3" }}>
                          <path d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z" fill="#0e0f11" style={{ fill: "#f5f3f3" }}></path>
                        </svg>
                      </div>
                    </div>
                    <div className="service-head">
                      <h4 className="font24" dangerouslySetInnerHTML={{ __html: (solution.name || "").replace(' ', '<br/>') }}></h4>
                    </div>
                  </div>
                  <div className="service-content">
                    <div className="service-para s-p mb-3">
                      <div dangerouslySetInnerHTML={{ __html: solution.description || "" }}></div>
                    </div>
                    <div className="service-btn mt-2">
                      <Link href={`/${solution.slug}`} className="textright morebtn font17">More Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {cities.length > 0 && (
        <section className="specfic-prop amenities pt-3 pb-5 aos-init" data-aos="fade-up">
          <div className="container-fluid">
            <div className="row mb-4">
              <div className="col-lg-6">
                <span className="section-title-span">locations</span>
              </div>
            </div>
            <div className="row">
              {cities.map((city) => (
                <div className="col-md-4 mb-lg-0 mb-2" key={city._id}>
                  <div className="box-loc">
                    <Link href={`/coworking-space/${city.slug}`}>{city.name}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactForm phone={phone} dropdownOptions={dropdownOptions} contactFormImage={footerData?.formImages?.contactFormImage || ""} />

      <Footer />
    </>
  );
}