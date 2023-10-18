import { Router } from 'express';

import getProducts from './products/getProducts';
import getOffers from './offers/getOffers';
import authentication from './auth/authentication';
import authorization from '../middleware/authorization';
import verifyToken from './auth/verifyToken';

import addProduct from './products/addProduct';
import updateProduct from './products/updateProduct';
import deleteProduct from './products/deleteProduct';

const router = Router();

router.use('/get-products', getProducts);
router.use('/get-special-offers', getOffers);
router.use('/authentication', authentication);
router.use('/verify-token', [authorization, verifyToken]);

router.use('/dashboard/add-product', [authorization, addProduct]);
router.use('/dashboard/update-product', [authorization, updateProduct]);
router.use('/dashboard/delete-product', [authorization, deleteProduct]);

export default router;
