import express from "express";
import {
  createService,
  getAllServices,
  updateService,
  deleteService,
  getSingleService,
} from "../controllers/ServiceController.js";

import { uploadFields, compressImages } from "../middlewares/multerService.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post(
  "/new-service",
  isAuthenticated,
  isAdmin,
  uploadFields,
  compressImages,
  createService
);

router.get("/all-services", getAllServices);

router.get("/:id", getSingleService);

router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  uploadFields,
  compressImages,
  updateService
);

router.delete("/:id", isAuthenticated, isAdmin, deleteService);

export default router;
