import { Router } from 'express';

import getProducts from './getProducts';
import getOffers from './getOffers';
import authentication from './authentication';

const router = Router();

router.use('/get-products', getProducts);
router.use('/get-special-offers', getOffers);
router.use('/authentication', authentication);

export default router;
