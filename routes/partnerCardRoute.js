import express from "express";
import { compressImage, uploadWithLimit } from "../middlewares/multer.js";
import { 
  deletePartnerCard, 
  getAllPartnerCards, 
  getSinglePartnerCard, 
  newPartnerCard 
} from "../controllers/PartnerCardController.js";

const router = express.Router();

router.post('/new-partner-card', uploadWithLimit, compressImage, newPartnerCard);

router.get('/all-partner-cards', getAllPartnerCards);

router.get('/:id', getSinglePartnerCard);

router.delete('/:id', deletePartnerCard);

export default router;
