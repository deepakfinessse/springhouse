import mongoose from "mongoose";

const headerSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
    },
    menu: [
      {
        title: {
          type: String,
        },
        url: {
          type: String,
        },
        links: [
          {
            label: {
              type: String,
            },
            url: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

export const Header =
  mongoose.models.Header || mongoose.model("Header", headerSchema);
