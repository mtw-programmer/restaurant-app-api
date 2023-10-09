import { Router } from 'express';
import verifyTokenController from '../../controllers/auth/verifyToken';

const router = Router();

router.post('/', verifyTokenController);

export default router;
