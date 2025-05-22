import express from "express";
import { compressImage, uploadWithLimit } from "../middlewares/multer.js";
import { deleteCompanyCard, getAllCompanyCard, getSingleCompanyCard, newCompanyCard } from "../controllers/CompanyCardController.js";

const router = express.Router();

router.post('/new-company-card', uploadWithLimit, compressImage, newCompanyCard);

router.get('/all-company-cards', getAllCompanyCard);

router.get('/:id', getSingleCompanyCard)

router.delete('/:id', deleteCompanyCard);


export default router;
