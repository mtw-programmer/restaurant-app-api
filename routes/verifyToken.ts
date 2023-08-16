import { Router } from 'express';
import verifyTokenController from '../controllers/verifyToken';

const router = Router();

router.post('/', verifyTokenController);

export default router;
