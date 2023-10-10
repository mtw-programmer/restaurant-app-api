import { Request, RequestHandler, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

type FileNameCallback = (error: Error | null, filename: string) => void;
type DestinationCallback = (error: Error | null, destination: string) => void;

const fileLimit = 7 * 1024 * 1024;

export default (req: Request, res:Response, filePath: string):RequestHandler => 
  multer({
    storage: multer.diskStorage({
      destination: (_req:Request, _file:Express.Multer.File, cb:DestinationCallback):void => {
        fs.mkdirSync(filePath, { recursive: true });
        cb(null, filePath);
      },
      filename: (_req:Request, file:Express.Multer.File, cb:FileNameCallback):void => {
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: fileLimit },
    fileFilter: (_req:Request, file:Express.Multer.File, cb:FileFilterCallback):void|Express.Response => {
      const fileFormats = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

      const fileSize = parseInt(req.headers['content-length']);
    
      if (fileSize > fileLimit)
        return res.status(400).json({ msg: 'We support only files up to 7MB!' });

      if (!fileFormats.includes(file.mimetype))
          return res.status(400).json({ msg: 'We support only jpg, jpeg, png and gif files!' });
      
      cb(null, true);
    }
  }).single('img');
