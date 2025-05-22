import mongoose from "mongoose";

// Reusable schema for title + desc
const TitleDescSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required."] },
    desc: { type: String, required: [true, "Description is required."] },
  },
  { _id: false }
);

// Strategy Section
const StrategySchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Strategy title is required."] },
    desc: {
      type: String,
      required: [true, "Strategy description is required."],
    },
    items: {
      type: [TitleDescSchema],
      required: [true, "Strategy items are required."],
      validate: [
        {
          validator: (val) => val.length >= 3,
          message: "Strategy must have at least 3 items.",
        },
      ],
    },
  },
  { _id: false }
);

// Benefits Section
const BenefitsSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Benefits title is required."] },
    items: {
      type: [TitleDescSchema],
      required: [true, "Benefits items are required."],
      validate: [
        {
          validator: (val) => val.length === 6,
          message: "Benefits must have exactly 6 items.",
        },
      ],
    },
  },
  { _id: false }
);

// How It Works Section
const HowItWorksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "How It Works title is required."],
    },
    desc: {
      type: String,
      required: [true, "How It Works description is required."],
    },
    items: {
      type: [TitleDescSchema],
      required: [true, "How It Works items are required."],
      validate: [
        {
          validator: (val) => val.length >= 4,
          message: "How It Works must have at least 4 items.",
        },
      ],
    },
  },
  { _id: false }
);

// Content Section
const ContentSectionSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Content section image is required."],
    },
    title: {
      type: String,
      required: [true, "Content section title is required."],
    },
    desc: {
      type: String,
      required: [true, "Content section description is required."],
    },
  },
  { _id: false }
);

// Banner Section - updated for multiple images
const BannerSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: String,
      required: [true, "Banner image is required."],
    },
    bannerTitle: {
      type: String,
      required: [true, "Banner title is required."],
    },
    bannerDesc: {
      type: String,
      required: [true, "Banner description is required."],
    },
    serviceName: {
      type: String,
      required: [true, "Service Name is required."],
    },
  },
  { _id: false }
);

// Main Service Schema
const ServiceSchema = new mongoose.Schema(
  {
    bannerSection: {
      type: BannerSchema,
      required: [true, "Banner section is required."],
    },
    selectedService: {
      type: String,
      required: [true, "Selected service is required."],
    },
    strategy: {
      type: StrategySchema,
      required: [true, "Strategy section is required."],
    },
    benefits: {
      type: BenefitsSchema,
      required: [true, "Benefits section is required."],
    },
    howItWorks: {
      type: HowItWorksSchema,
      required: [true, "How It Works section is required."],
    },
    contentSection: {
      type: ContentSectionSchema,
      required: [true, "Content section is required."],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Service", ServiceSchema);
