import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';
import fs from 'fs';
import errorHandle from '../../utils/errorHandling/router';
import Product from '../../models/Product';

const router = Router();

router.delete('/:id', async (req:Request, res:Response) => {
  try {
    const { id } = req.params;

    if(!Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: 'Invalid ID!' });

    if (!await Product.exists({ _id: id }))
      return res.status(400).json({ msg: 'Invalid ID!' });
    
    await Product.deleteOne({ _id: id });
    fs.rmSync(`./media/${id}`, { recursive: true, force: true });

    return res.json({ msg: 'Successfully removed product with the given ID!' });
  } catch (ex) {
    errorHandle('Delete Product', res, ex);
  }
});

export default router;
