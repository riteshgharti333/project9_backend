import express from "express";
import {
  createService,
  getAllServices,
  updateService,
  deleteService,
  getSingleService,
} from "../controllers/ServiceController.js";

import { uploadFields, compressImages } from "../middlewares/multerService.js";

const router = express.Router();

router.post("/new-service", uploadFields, compressImages, createService);

router.get("/all-services", getAllServices);

router.get("/:id", getSingleService);

router.put("/:id", uploadFields, compressImages, updateService);

router.delete("/:id", deleteService);

export default router;
