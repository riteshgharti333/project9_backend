import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import Review from "../models/reviewModel.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

export const createReview = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    throw new ErrorHandler("Review image is required!", 400);
  }

  const { name, description } = req.body;
  if (!name || !description) {
    throw new ErrorHandler("Name and description are required!", 400);
  }

  let imageUrl;

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "sm_project/reviews",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    imageUrl = result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new ErrorHandler("Failed to upload image to Cloudinary", 500);
  }

  const review = await Review.create({
    name,
    description,
    image: imageUrl,
  });

  res.status(201).json({
    success: true,
    message: "Review created successfully!",
    review,
  });
});

export const getReviewById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    return next(new ErrorHandler("Review not found!", 404));
  }

  res.status(200).json({
    success: true,
    review,
  });
});

export const getAllReviews = catchAsyncError(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    success: true,
    reviews,
  });
});

export const deleteReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    return next(new ErrorHandler("Review not found!", 404));
  }

  // Delete image from cloudinary
  if (review.image) {
    const parts = review.image.split("/");
    const publicIdWithExtension = parts[parts.length - 1]; // e.g. "abc123.jpg"
    const publicId = `sm_project/reviews/${
      publicIdWithExtension.split(".")[0]
    }`;

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary deletion error:", error);
    }
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully!",
  });
});

export const updateReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const review = await Review.findById(id);
  if (!review) {
    return next(new ErrorHandler("Review not found!", 404));
  }

  // Update text fields if provided
  if (name) review.name = name;
  if (description) review.description = description;

  // If new image file is provided, upload and replace
  if (req.file) {
    // Delete old image first
    if (review.image) {
      const parts = review.image.split("/");
      const publicIdWithExtension = parts[parts.length - 1];
      const publicId = `sm_project/reviews/${
        publicIdWithExtension.split(".")[0]
      }`;
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Cloudinary deletion error:", error);
      }
    }

    // Upload new image
    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "sm_project/reviews",
            transformation: [{ quality: "auto", fetch_format: "auto" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      review.image = result.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw new ErrorHandler("Failed to upload image to Cloudinary", 500);
    }
  }

  await review.save();

  res.status(200).json({
    success: true,
    message: "Review updated successfully!",
    review,
  });
});
