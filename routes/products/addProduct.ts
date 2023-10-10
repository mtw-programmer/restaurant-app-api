import { Router } from 'express';
import addProductController from '../../controllers/products/addProduct';

const router = Router();

router.put('/', addProductController);

export default router;
