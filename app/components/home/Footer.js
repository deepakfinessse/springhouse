import Link from "next/link";
import connectDB from "@/utils/db";
import FooterModel from "@/model/footer.model";

export default async function Footer() {
  await connectDB();
  const footerData = (await FooterModel.findOne({})) || {};

  const columns = footerData.columns || [];
  const socialLinks = footerData.socialLinks || {};
  const contactInfo = footerData.contactInfo || {};
  const bottomBlocks = footerData.bottomBlocks || "";
  return (
    <>
      <footer className="relative">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-7 pe-5">
              <div className="row">
                {columns.map((col, idx) => (
                  <div className="col-md-3 mb-lg-0 mb-md-0 mb-4" key={idx}>
                    <div className="widgt">
                      <h3>{col.title}</h3>
                      <ul className="footer-link">
                        {col.links?.map((link, lIdx) => (
                          <li key={lIdx}>
                            <Link href={link.url || "#"}>{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                <div className="col-lg-12">
                  <div
                    className="dynamic-footer-bottom pt-5 ql-content"
                    dangerouslySetInnerHTML={{ __html: bottomBlocks }}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4 ps-4">
              <div className="footer-follow">
                <div className="footer-box">
                  <div className="follow-head">
                    <p className="font20">Follow us</p>
                  </div>
                  <div className="follow-social-link mt-3">
                    {socialLinks.instagram && (
                      <a
                        href={socialLinks.instagram}
                        className="insta"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="actule"
                          src="/frontend_assets/img/insta-hover.png"
                          alt="working space – SpringHouse coworking office view"
                        />
                        <img
                          className="black-i"
                          src="/frontend_assets/img/Instagram.png"
                          alt="rent a coworking space – SpringHouse coworking office view"
                        />
                      </a>
                    )}

                    {socialLinks.facebook && (
                      <a
                        href={socialLinks.facebook}
                        className="face"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="actule"
                          src="/frontend_assets/img/fb-hover.png"
                          alt="working space – SpringHouse coworking office view"
                        />
                        <img
                          className="black-i"
                          src="/frontend_assets/img/Facebook.png"
                          alt="working space – SpringHouse coworking office view"
                        />
                      </a>
                    )}

                    {socialLinks.linkedin && (
                      <a
                        href={socialLinks.linkedin}
                        className="link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="actule"
                          src="/frontend_assets/img/linkedin-hover.png"
                          alt="working space – SpringHouse coworking office view"
                        />
                        <img
                          className="black-i"
                          src="/frontend_assets/img/LinkedIn.png"
                          alt="coworking spaces – SpringHouse coworking office view"
                        />
                      </a>
                    )}
                  </div>
                </div>
                <div className="footer-box">
                  <div className="follow-head">
                    <p className="font20">Head quarters</p>
                  </div>
                  <div className="follow-address">
                    <p className="text-white">
                      {contactInfo.address ||
                        "LG 006, DLF Grand Mall, MG Rd, Gurugram, Haryana 122001"}
                    </p>
                  </div>
                </div>
                <div className="footer-box">
                  <div className="follow-head">
                    <p className="font20 mb20">CONTACT US</p>
                  </div>
                  <div className="follow-address">
                    {contactInfo.phone && (
                      <a href={`tel:${contactInfo.phone}`}>
                        <p>
                          <i
                            className="fa fa-phone"
                            style={{ fontFamily: "'FontAwesome'" }}
                          ></i>{" "}
                          {contactInfo.phone}
                        </p>
                      </a>
                    )}
                    {contactInfo.whatsapp && (
                      <a
                        href={`https://api.whatsapp.com/send?phone=${contactInfo.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <p>
                          <i
                            className="fa fa-whatsapp"
                            style={{ fontFamily: "'FontAwesome'" }}
                          ></i>{" "}
                          {contactInfo.whatsapp}
                        </p>
                      </a>
                    )}
                    {contactInfo.email && (
                      <a href={`mailto:${contactInfo.email}`}>
                        <p>{contactInfo.email}</p>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="footer-end-bar">
        <span className="end-credit">
          All rights reserved. See our terms of use and privacy notice. Design
          by <a href="https://www.anagramco.in/" target="_blank"> anagramco.in </a> 
        </span>
      </div>

      {contactInfo.whatsapp && (
        <a
          href={`https://api.whatsapp.com/send?phone=${contactInfo.whatsapp.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .whatsapp {
            background-color: #25D366;
            border-radius: 50%;
            position: fixed !important;
            bottom: 20px;
            font-size: 30px;
            color: #fff !important;
            opacity: 1 !important;
            z-index: 9;
            right: 15px;
            width: 50px;
            height: 50px;
            text-align: center;
            line-height: 55px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
        }
        .whatsapp i {
            font-size: 35px;
        }
        @media (max-width: 768px) {
            .whatsapp {
                bottom: 15px;
                right: 15px;
                width: 40px;
                height: 40px;
                line-height: 45px;
                z-index: 99;
            }
            .whatsapp i {
                font-size: 24px;
            }
        }
            .dynamic-footer-bottom{ 
max-width: 800px;
            }
        .dynamic-footer-bottom p {
            margin-bottom: 5px;
            font-size: 12px;
            color: var(--theme-whitecolor);
            font-family: var(--theme-mainpara);
        }
        .dynamic-footer-bottom p:empty {
            min-height: 10px;
            display: block;
        }
        .dynamic-footer-bottom a {
            font-size: 12px;
            color: var(--theme-whitecolor);
            font-family: var(--theme-mainpara);
            font-weight: 400;
            position: relative;
            padding: 0px 8px;
            text-wrap-mode: nowrap;
            white-space: nowrap;
            text-decoration: none;
            display: inline-block;
        }
        .dynamic-footer-bottom a::after {
            content: "";
            position: absolute;
            right: 0px;
            top: 52%;
            transform: translateY(-45%);
            width: 1px;
            height: 53%;
            border-right: 1px solid var(--theme-whitecolor);
        }
        .dynamic-footer-bottom a:last-child::after {
            border-right: none;
        }
      `,
        }}
      />
    </>
  );
}
