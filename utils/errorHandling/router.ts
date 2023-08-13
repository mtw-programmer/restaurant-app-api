import { Response } from 'express';
import log from '../log';

export default (label: string, res: Response, msg: string):Response => {
  log.error({ label, message: `${msg}` });
  return res.status(500).json({ msg: 'Something went wrong! Please, try again later.' });
};
