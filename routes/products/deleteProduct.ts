import { Router } from 'express';
import deleteProductController from '../../controllers/products/deleteProduct';

const router = Router();

router.delete('/:id', deleteProductController);

export default router;
