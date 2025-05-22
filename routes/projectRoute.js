import express from "express";
import {
  createProject,
  getProjectById,
  getAllProjects,
  deleteProject,
  updateProject,
} from "../controllers/ProjectController.js";
import { uploadWithLimit, compressImage } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new-project", uploadWithLimit, compressImage, createProject);

router.get("/all-projects", getAllProjects);

router.get("/:id", getProjectById);

router.put("/:id", uploadWithLimit, compressImage, updateProject);

router.delete("/:id", deleteProject);

export default router;
