import express from "express";
import {
  createContact,
  getAllContacts,
  getSingleContact,
  deleteContact,
} from "../controllers/ContactController.js";

const router = express.Router();

router.post("/new-contact", createContact);

router.get("/all-contacts", getAllContacts);

router.get("/:id", getSingleContact);

router.delete("/:id", deleteContact);

export default router;
