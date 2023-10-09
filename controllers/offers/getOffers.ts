import { Router, Request, Response } from 'express';
import errorHandle from '../../utils/errorHandling/router';
import Offer from '../../models/Offer';

const router = Router();

router.get('/', async (_req:Request, res:Response) => {
  try {
    const offers = await Offer.find().populate('items');
    return res.json({ offers });
  } catch (ex) {
    errorHandle('Get Offers', res, ex);
  }
});

export default router;
