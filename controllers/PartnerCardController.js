import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

import PartnerCard from "../models/partnerCardModel.js";

import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";

export const newPartnerCard = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    throw new ErrorHandler("Partner card image is required!", 400);
  }

  let imageUrl;

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "sm_project/partner_cards",
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

  const partnerCard = await PartnerCard.create({
    image: imageUrl,
  });

  res.status(201).json({
    success: true,
    message: "Partner card image added successfully!",
    partnerCard,
  });
});

// GET SINGLE Partner Card
export const getSinglePartnerCard = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const partnerCard = await PartnerCard.findById(id);

  if (!partnerCard) {
    return next(new ErrorHandler("Partner card image not found!", 404));
  }

  res.status(200).json({
    success: true,
    partnerCard,
  });
});

// GET All Partner Cards
export const getAllPartnerCards = catchAsyncError(async (req, res, next) => {
  const partnerCards = await PartnerCard.find();

  res.status(200).json({
    success: true,
    partnerCards,
  });
});

// DELETE Partner Card
export const deletePartnerCard = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler("Invalid ID format!", 400);
  }

  const partnerCard = await PartnerCard.findById(id);

  if (!partnerCard) {
    return next(new ErrorHandler("Partner card image not found!", 404));
  }

  const imageUrl = partnerCard.image;
  if (imageUrl) {
    // Extract publicId assuming the URL format contains the filename at the end
    const publicId = imageUrl.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(`sm_project/partner_cards/${publicId}`);
  }

  await partnerCard.deleteOne();

  res.status(200).json({
    success: true,
    message: "Partner card image deleted successfully!",
  });
});
