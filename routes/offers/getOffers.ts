import { Router } from 'express';
import getOffersController from '../../controllers/offers/getOffers';

const router = Router();

router.get('/', getOffersController);

export default router;
