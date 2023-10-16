import { Router, Request, Response, RequestHandler } from 'express';
import { Types } from 'mongoose';
import { MulterError } from 'multer';
import fs from 'fs';
import errorHandle from '../../utils/errorHandling/router';
import uploadFile from '../../utils/upload';
import validate from '../../validate/updateProduct';
import Product from '../../models/Product';

const router = Router();
const _id = new Types.ObjectId();

router.patch('/:id', async (req:Request, res:Response) => {
  const { id } = req.params;

  if(!Types.ObjectId.isValid(id))
    return res.status(400).json({ msg: 'Invalid ID!' });

  if (!await Product.exists({ _id: id }))
    return res.status(400).json({ msg: 'Invalid ID!' });

  const path = `./media/products/${_id}`;

  const upload = uploadFile(req, res, path);

  const { img } = await Product.findOne({ _id: id }).select('img');
  
  upload(req, res, async (err) => {
    const { title, description, price } = req.body;

    if (req.file !== undefined) {
      if (err instanceof MulterError)
        return res.status(400).json({ msg: err });
      else if (err)
        errorHandle('Update Product / Upload', res, `${err}`);

      if (title || description || price) {
        const { error } = validate(req.body);
        if (error)
          return res.status(400).json({ msg: error.details[0].message });
      }

      await Product.updateOne({ _id: id }, {
        title,
        img: req.file.filename,
        description,
        price
      });

      if (fs.existsSync(`${path}/${img}`))
        fs.unlinkSync(`${path}/${img}`);

      return res.json({ msg: 'Successfully updated the product!' })
    } else {
      const { error } = validate(req.body);

      if (!(title || description || price))
        return res.status(400).json({ msg: 'No properties given to update!' });

      if (error)
        return res.status(400).json({ msg: error.details[0].message });

      await Product.updateOne({ _id: id }, {
        title,
        description,
        price
      });

      return res.json({ msg: 'Successfully updated the product!' });
    }
  });
});

export default router;
