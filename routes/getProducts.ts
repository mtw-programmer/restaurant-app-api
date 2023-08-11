import { Router } from 'express';
import getProductsController from '../controllers/getProducts';

const router = Router();

router.get('/', getProductsController);

export default router;
