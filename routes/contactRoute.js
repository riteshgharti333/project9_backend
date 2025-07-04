import express from "express";
import {
  createContact,
  getAllContacts,
  getSingleContact,
  deleteContact,
} from "../controllers/ContactController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/new-contact", createContact);

router.get("/all-contacts", getAllContacts);

router.get("/:id", getSingleContact);

router.delete("/:id", isAuthenticated, isAdmin, deleteContact);

export default router;
