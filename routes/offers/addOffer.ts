import { Router } from 'express';
import addOfferController from '../../controllers/offers/addOffer';

const router = Router();

router.put('/', addOfferController);

export default router;
