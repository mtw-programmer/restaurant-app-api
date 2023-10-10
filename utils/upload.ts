import { Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const fileLimit = 7 * 1024 * 1024;

export default (req: Request, res:Response, filePath: string) => 
  multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        fs.mkdirSync(filePath, { recursive: true });
        cb(null, filePath);
      },
      filename: (_req, file, cb) => {
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: fileLimit },
    fileFilter: (_req, file, cb) => {
      const fileFormats = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

      const fileSize = parseInt(req.headers['content-length']);
    
      if (fileSize > fileLimit)
        return res.status(400).json({ msg: 'We support only files up to 7MB!' });

      if (!fileFormats.includes(file.mimetype))
          return res.status(400).json({ msg: 'We support only jpg, jpeg, png and gif files!' });
      
      cb(null, true);
    }
  }).single('img');
