import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema(
  {
    mainBanner: {
      type: String,
    },
    heroVideo: {
      type: String,
    },
    subHeading: {
      type: String,
    },
    heading: {
      type: String,
    },
    presence: [
      {
        number: Number,
        title: String,
        beforeNumber: String,
        afterNumber: String,
      },
    ],
    activeCities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
      },
    ],
    activeSolutions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Solution",
      },
    ],
    features: [
      {
        content: String,
        image: String,
      },
    ],
    solutionsForEveryone: {
      content: String,
      image: String,
    },
    networking: {
      title: String,
      content: String,
      image: String,
      tooltips: {
        type: [String],
        default: ["", "", ""],
      },
    },
    ourCommunity: [
      {
        type: String,
      },
    ],
    testimonials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Testimonial",
      },
    ],
    seo: {
      metaTitle: String,
      metaDescription: String,
      codeSnippet: String,
    },
  },
  { timestamps: true },
);

const Homepage =
  mongoose.models.Homepage || mongoose.model("Homepage", homepageSchema);

// Force clear cache in development if schema changed
if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Homepage;
}

export { Homepage };
