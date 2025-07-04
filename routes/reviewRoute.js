import express from "express";
import {
  createReview,
  getReviewById,
  getAllReviews,
  deleteReview,
  updateReview,
} from "../controllers/ReviewController.js";
import { uploadWithLimit, compressImage } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post(
  "/new-review",
  isAuthenticated,
  isAdmin,
  uploadWithLimit,
  compressImage,
  createReview
);

router.get("/all-reviews", getAllReviews);

router.get("/:id", getReviewById);

router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  uploadWithLimit,
  compressImage,
  updateReview
);

router.delete("/:id", isAuthenticated, isAdmin, deleteReview);

export default router;
