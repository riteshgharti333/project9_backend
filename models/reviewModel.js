import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Reviewer's name is required"],
      trim: true,
      maxlength: [50, "Name must not exceed 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Review description is required"],
      trim: true,
      maxlength: [500, "Description must not exceed 500 characters"],
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
