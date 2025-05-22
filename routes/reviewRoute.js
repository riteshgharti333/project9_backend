import express from "express";
import {
  createReview,
  getReviewById,
  getAllReviews,
  deleteReview,
  updateReview,
} from "../controllers/ReviewController.js";
import { uploadWithLimit, compressImage } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new-review", uploadWithLimit, compressImage, createReview);

router.get("/all-reviews", getAllReviews);

router.get("/:id", getReviewById);

router.put("/:id", uploadWithLimit, compressImage, updateReview);

router.delete("/:id", deleteReview);

export default router;
