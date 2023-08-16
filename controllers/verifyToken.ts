import { Router, Request, Response } from 'express';
import errorHandle from '../utils/errorHandling/router';

const router = Router();

router.post('/', async (_req:Request, res:Response) => {
  try {
    return res.json({ msg: 'Token successfully verified!' });
  } catch (ex) {
    errorHandle('Token Verify', res, ex);
  }
});

export default router;
