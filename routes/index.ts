import { Router } from 'express';

import getProducts from './getProducts';
import getOffers from './getOffers';

const router = Router();

router.use('/get-products', getProducts);
router.use('/get-special-offers', getOffers);

export default router;
