import express from "express";
import {
  createProject,
  getProjectById,
  getAllProjects,
  deleteProject,
  updateProject,
} from "../controllers/ProjectController.js";
import { uploadWithLimit, compressImage } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post(
  "/new-project",
  isAuthenticated,
  isAdmin,
  uploadWithLimit,
  compressImage,
  createProject
);

router.get("/all-projects", getAllProjects);

router.get("/:id", getProjectById);

router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  uploadWithLimit,
  compressImage,
  updateProject
);

router.delete("/:id", isAuthenticated, isAdmin, deleteProject);

export default router;
