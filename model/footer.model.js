import mongoose from "mongoose";

const footerSchema = new mongoose.Schema(
  {
    // 1. Top columns (Company, Locations, Solutions)
    columns: [
      {
        title: { type: String, required: true },
        links: [
          {
            label: { type: String, required: true },
            url: { type: String, required: true },
          },
        ],
      },
    ],

    // 2. Bottom text editor content
    bottomBlocks: { type: String, default: "" },

    // 3. Social Media Icons URLs
    socialLinks: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },

    // 4. Contact and Address section
    contactInfo: {
      address: { type: String, default: "" },
      phone: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      email: { type: String, default: "" },
    },

    // 5. Form Images (Contact & Career form sidebar images)
    formImages: {
      contactFormImage: { type: String, default: "" },
      careerFormImage: { type: String, default: "" },
    },

    // 6. Page Banners
    pageBanners: {
      careerHeroBanner: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

if (mongoose.models.Footer) {
  delete mongoose.models.Footer;
}
const Footer = mongoose.model("Footer", footerSchema);

export default Footer;
