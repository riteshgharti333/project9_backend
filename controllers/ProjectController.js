import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import Project from "../models/projectModel.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

export const createProject = catchAsyncError(async (req, res, next) => {

  if (!req.file) {
    throw new ErrorHandler("Project image is required!", 400);
  }

  const { name, desc, url } = req.body;

  let imageUrl;

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "sm_project/project",
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

  const project = await Project.create({
    name,
    desc,
    url,
    image: imageUrl,
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully!",
    project,
  });
});

export const getProjectById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    return next(new ErrorHandler("Project not found!", 404));
  }

  res.status(200).json({
    success: true,
    project,
  });
});

export const getAllProjects = catchAsyncError(async (req, res, next) => {
  const projects = await Project.find();

  res.status(200).json({
    success: true,
    projects,
  });
});

export const deleteProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    return next(new ErrorHandler("Project not found!", 404));
  }

  // Delete image from cloudinary
  if (project.image) {
    const parts = project.image.split("/");
    const publicIdWithExtension = parts[parts.length - 1]; // e.g. "abc123.jpg"
    const publicId = `sm_project/projects/${
      publicIdWithExtension.split(".")[0]
    }`;

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary deletion error:", error);
    }
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: "Project deleted successfully!",
  });
});

export const updateProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, desc , url} = req.body;

  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Project not found!", 404));
  }

  // Update text fields if provided
  if (name) project.name = name;
  if (desc) project.desc = desc;
  if (url) project.url = url;

  // If new image file is provided, upload and replace
  if (req.file) {
    // Delete old image first
    if (project.image) {
      const parts = project.image.split("/");
      const publicIdWithExtension = parts[parts.length - 1];
      const publicId = `sm_project/projects/${
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
            folder: "sm_project/projects",
            transformation: [{ quality: "auto", fetch_format: "auto" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      project.image = result.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw new ErrorHandler("Failed to upload image to Cloudinary", 500);
    }
  }

  await project.save();

  res.status(200).json({
    success: true,
    message: "Project updated successfully!",
    project,
  });
});
