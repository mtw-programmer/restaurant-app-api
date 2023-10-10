import { Router, Request, Response, RequestHandler } from 'express';
import { Types } from 'mongoose';
import { MulterError } from 'multer';
import path from 'path';
import errorHandle from '../../utils/errorHandling/router';
import uploadFile from '../../utils/upload';
import validate from '../../validate/addProduct';
import Product from '../../models/Product';

const router = Router();
const _id = new Types.ObjectId();

router.put('/', async (req:Request, res:Response) => {
  const upload = uploadFile(req, res, `./media/products/${_id}`)
  
  upload(req, res, async (err) => {
    if (req.file === undefined)
      return res.status(400).json({ msg: 'No file provided!' });

    if (err instanceof MulterError)
      return res.status(400).json({ msg: err });
    else if (err)
      errorHandle('Add Product / Upload', res, `${err}`);

    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ msg: error.details[0].message });

    const { title, description, price } = req.body;

    const product = new Product({
      _id,
      title,
      img: req.file.filename,
      description,
      price
    });

    await product.save();

    return res.json({ msg: 'Successfully added new product!' })
  });
});

export default router;
