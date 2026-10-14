import AosInit from "../components/AosInit";
import GlobalScripts from "../components/GlobalScripts";
import ModalsAndScripts from "../components/home/ModalsAndScripts";
import connectDB from "@/utils/db";
import FooterModel from "@/model/footer.model";
import { getDropdownOptions } from "@/utils/dropdowns";

// CSS files are loaded via <link> tags in the root app/layout.js

export default async function WebsiteLayout({ children }) {
  await connectDB();
  const footerData = (await FooterModel.findOne({}).lean()) || {};
  const phone = footerData?.contactInfo?.phone || "";
  const formImages = footerData?.formImages
    ? JSON.parse(JSON.stringify(footerData.formImages))
    : {};
  const dropdownOptions = await getDropdownOptions();

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"
      />
      <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/css/lightgallery-bundle.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css"
      />

      <link rel="stylesheet" href="/frontend_assets/css/main.css?v=1.0" />
      <link rel="stylesheet" href="/frontend_assets/css/style.css?v=1.3" />
      <link rel="stylesheet" href="/frontend_assets/css/responsive.css?v=1.0" />
      <link rel="stylesheet" href="/frontend_assets/css/quill-content.css" />

      <AosInit />
      {children}
      <ModalsAndScripts phone={phone} dropdownOptions={dropdownOptions} formImages={formImages} />
      <GlobalScripts />
    </>
  );
}
