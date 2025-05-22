import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import Service from "../models/serviceModel.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import { extractPublicId } from "../utils/extactId.js";

async function uploadToCloudinary(buffer, folder, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

async function deleteFromCloudinary(publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
}

export const createService = catchAsyncError(async (req, res, next) => {
  if (!req.body.serviceData) {
    throw new ErrorHandler("serviceData JSON string is required.", 400);
  }

  const serviceData = JSON.parse(req.body.serviceData);

  const { bannerImage, contentSectionImage } = req.files || {};


   if (!bannerImage || !bannerImage[0]) {
    throw new ErrorHandler("Banner image is missing.", 400);
  }

  if (!contentSectionImage || !contentSectionImage[0]) {
    throw new ErrorHandler("Content section image is missing.", 400);
  }


  // Upload banner image
  const bannerUpload = await uploadToCloudinary(
    bannerImage[0].buffer,
    "sm_project/service_images",
    bannerImage[0].originalname
  );
  serviceData.bannerSection.bannerImage = bannerUpload.secure_url;

 

  // Upload content section image
  const contentImageUpload = await uploadToCloudinary(
    contentSectionImage[0].buffer,
    "sm_project/service_images",
    contentSectionImage[0].originalname
  );
  serviceData.contentSection.image = contentImageUpload.secure_url;

  // Save the service in DB (Mongoose will handle validation)
  const service = await Service.create(serviceData);

  res.status(201).json({
    success: true,
    message: "Service created successfully with all images uploaded!",
    service,
  });
});


export const getAllServices = catchAsyncError(async (req, res, next) => {
  const services = await Service.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    services,
  });
});

export const getSingleService = catchAsyncError(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorHandler("Service not found", 404));
  }

  res.status(200).json({
    success: true,
    service,
  });
});

export const deleteService = catchAsyncError(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorHandler("Service not found", 404));
  }

  // Extract public IDs from all images
  const publicIds = [];

  // Banner image
  if (service.bannerSection?.bannerImage) {
    publicIds.push(extractPublicId(service.bannerSection.bannerImage));
  }


  // Content section image
  if (service.contentSection?.image) {
    publicIds.push(extractPublicId(service.contentSection.image));
  }

  // Delete all images from Cloudinary
  await Promise.all(
    publicIds.map((publicId) =>
      deleteFromCloudinary(publicId).catch(console.error)
    )
  );

  // Delete the service document
  await service.deleteOne();

  res.status(200).json({
    success: true,
    message: "Service deleted successfully",
  });
});

export const updateService = catchAsyncError(async (req, res, next) => {
  if (!req.body.serviceData) {
    throw new ErrorHandler(
      "serviceData JSON string is required in the body.",
      400
    );
  }

  const service = await Service.findById(req.params.id);
  if (!service) {
    return next(new ErrorHandler("Service not found", 404));
  }

  const serviceData = JSON.parse(req.body.serviceData);
  const imagesToDelete = [];

  // Handle banner image update
  if (req.files?.bannerImage?.[0]) {
    const oldBannerId = extractPublicId(service.bannerSection.bannerImage);
    imagesToDelete.push(oldBannerId);

    const bannerFile = req.files.bannerImage[0];
    const bannerImageResult = await uploadToCloudinary(
      bannerFile.buffer,
      "sm_project/service_images",
      bannerFile.originalname
    );
    serviceData.bannerSection = serviceData.bannerSection || {};
    serviceData.bannerSection.bannerImage = bannerImageResult.secure_url;
  }


  // Handle content section image update
  if (req.files?.contentSectionImage?.[0]) {
    const oldContentId = extractPublicId(service.contentSection.image);
    imagesToDelete.push(oldContentId);

    const contentFile = req.files.contentSectionImage[0];
    const contentImageResult = await uploadToCloudinary(
      contentFile.buffer,
      "sm_project/service_images",
      contentFile.originalname
    );
    serviceData.contentSection = serviceData.contentSection || {};
    serviceData.contentSection.image = contentImageResult.secure_url;
  }

  // Update the service document
  const updatedService = await Service.findByIdAndUpdate(
    req.params.id,
    { $set: serviceData },
    { new: true, runValidators: true }
  );

  // Delete old images after successful update
  await Promise.all(
    imagesToDelete.map((publicId) =>
      deleteFromCloudinary(publicId).catch(console.error)
    )
  );

  res.status(200).json({
    success: true,
    message: "Service updated successfully",
    service: updatedService,
  });
});
