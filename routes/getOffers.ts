import { Router } from 'express';
import getOffersController from '../controllers/getOffers';

const router = Router();

router.get('/', getOffersController);

export default router;
