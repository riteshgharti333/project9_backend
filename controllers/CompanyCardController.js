import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

import CompanyCard from "../models/companyCardModel.js";

import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";

export const newCompanyCard = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    throw new ErrorHandler("Company card image is required!", 400);
  }

  let imageUrl;

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "sm_project/company_cards",
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

  const companyCard = await CompanyCard.create({
    image: imageUrl,
  });

  res.status(201).json({
    success: true,
    message: "Company card image added successfully!",
    companyCard,
  });
});

// GET SINGLE Company Card

export const getSingleCompanyCard = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const companyCard = await CompanyCard.findById(id);

  if (!catchAsyncErrorompanyCard) {
    return next(new ErrorHandler("Company card image not found!", 404));
  }

  res.status(200).json({
     success: true,
    companyCard,
  });
});

// GET All Company Card

export const getAllCompanyCard = catchAsyncError(async (req, res, next) => {
  const companyCard = await CompanyCard.find();

  res.status(200).json({
     success: true,
    companyCard,
  });
});

// DELETE Company Card

export const deleteCompanyCard = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler("Invalid ID format!", 400);
  }

  const companyCard = await CompanyCard.findById(id);

  if (!companyCard) {
    return next(new ErrorHandler("Company card image not found!", 404));
  }

  const imageUrl = companyCard.image;
  if (imageUrl) {
    const publicId = imageUrl.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(
      `sm_project/company_cards/${publicId}`
    );
  }

  await companyCard.deleteOne();

  res.status(200).json({
     success: true,
    message: "Company card image deleted successfully!",
  });
});
