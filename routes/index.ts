import { Router } from 'express';

import getProducts from './products/getProducts';
import getOffers from './offers/getOffers';
import authentication from './auth/authentication';
import authorization from '../middleware/authorization';
import verifyToken from './auth/verifyToken';

const router = Router();

router.use('/get-products', getProducts);
router.use('/get-special-offers', getOffers);
router.use('/authentication', authentication);
router.use('/verify-token', [authorization, verifyToken]);

export default router;
