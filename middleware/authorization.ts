import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import Admin from '../models/Admin';
import errorHandle from '../utils/errorHandling/router';

export default async function (req:Request, res:Response, next:NextFunction) {
  try {
    const token = req.headers['x-auth-token'];

    if (!token) {
      return res.status(401).json({ msg: 'Access denied! Please, log in!' });
    }

    const userId = jwt.verify(token, config.TOKEN_SECRET);

    if (!userId) {
      return res.status(401).json({ msg: 'Access denied! Please, log in!' });
    }
   
    if (!await Admin.exists({ _id: userId }))
      return res.status(400).json({ msg: 'Invalid token!' });

    next();
  } catch (ex) {
      errorHandle('Authorization', res, ex);
  }
}
