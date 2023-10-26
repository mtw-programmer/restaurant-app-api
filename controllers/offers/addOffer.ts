import { Router, Request, Response } from 'express';
import config from '../../utils/config';
import moment from 'moment-timezone';
import errorHandle from '../../utils/errorHandling/router';
import validate from '../../validate/addOffer';
import Offer from '../../models/Offer';
import Product from '../../models/Product';

moment().tz(config.TZ || 'Europe/Warsaw').format();

const router = Router();

router.put('/', async (req:Request, res:Response) => {
  try {
    const { error } = validate(req.body)
    if (error)
      return res.status(400).json({ msg: error.details[0].message });

    if (moment(req.body.expires) <= moment())
      return res.status(400).json({ msg: 'The given date is expired!' });
    
    const products = await Product.find({ _id: { $in: req.body.items }});

    if (req.body.items.length !== products.length)
      return res.status(400).json({ msg: 'The given item has an invalid ID!' });

    const { items, price, expires } = req.body;

    const offer = new Offer({ items, price, expires });
    await offer.save();

    return res.json({ msg: 'Successfully added a new offer!' });
  } catch (ex) {
    errorHandle('Add Offer', res, ex);
  }
});

export default router;
