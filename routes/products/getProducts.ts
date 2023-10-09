import { Router } from 'express';
import getProductsController from '../../controllers/products/getProducts';

const router = Router();

router.get('/', getProductsController);

export default router;
