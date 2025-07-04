import express from "express";
import { compressImage, uploadWithLimit } from "../middlewares/multer.js";
import {
  deleteCompanyCard,
  getAllCompanyCard,
  getSingleCompanyCard,
  newCompanyCard,
} from "../controllers/CompanyCardController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post(
  "/new-company-card",
  isAuthenticated,
  isAdmin,
  uploadWithLimit,
  compressImage,
  newCompanyCard
);

router.get("/all-company-cards", getAllCompanyCard);

router.get("/:id", getSingleCompanyCard);

router.delete("/:id", isAuthenticated, isAdmin, deleteCompanyCard);

export default router;
