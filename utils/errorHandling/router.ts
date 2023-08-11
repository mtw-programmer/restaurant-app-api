import { Response } from 'express';
import log from '../log';

export default (res: Response, msg: string):Response => {
  log.error({ label: 'getProducts', message: `${msg}` });
  return res.status(500).json({ msg: 'Something went wrong! Please, try again later.' });
};
