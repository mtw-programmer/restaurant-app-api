import { Router } from 'express';
import updateProductController from '../../controllers/products/updateProduct';

const router = Router();

router.patch('/:id', updateProductController);

export default router;
