import { Router } from 'express';
import authenticationController from '../controllers/auth/authentication';

const router = Router();

router.post('/', authenticationController);

export default router;
