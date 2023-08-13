import { Router } from 'express';

import getProducts from './getProducts';
import getOffers from './getOffers';
import authentication from './authentication';
import authorization from '../middleware/authorization';
import verifyToken from './verifyToken';

const router = Router();

router.use('/get-products', getProducts);
router.use('/get-special-offers', getOffers);
router.use('/authentication', authentication);
router.use('/verify-token', [authorization, verifyToken]);

export default router;
