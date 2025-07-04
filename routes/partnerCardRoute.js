import express from "express";
import { compressImage, uploadWithLimit } from "../middlewares/multer.js";
import {
  deletePartnerCard,
  getAllPartnerCards,
  getSinglePartnerCard,
  newPartnerCard,
} from "../controllers/PartnerCardController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post(
  "/new-partner-card",
  isAuthenticated,
  isAdmin,
  uploadWithLimit,
  compressImage,
  newPartnerCard
);

router.get("/all-partner-cards", getAllPartnerCards);

router.get("/:id", getSinglePartnerCard);

router.delete("/:id", isAuthenticated, isAdmin, deletePartnerCard);

export default router;
