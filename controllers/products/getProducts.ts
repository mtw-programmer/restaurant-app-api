import { Router, Request, Response } from 'express';
import errorHandle from '../../utils/errorHandling/router';
import Product from '../../models/Product';

const router = Router();

router.get('/', async (_req:Request, res:Response) => {
  try {
    const products = await Product.find();
    return res.json({ products });
  } catch (ex) {
    errorHandle('Get Products', res, ex);
  }
});

export default router;
