import { Router, Request, Response } from 'express';
import Admin from '../models/Admin';
import bcrypt from 'bcrypt';

import errorHandle from '../utils/errorHandling/router';
import validate from '../validate/authentication';
import generateAuthToken from '../utils/generateAuthToken';

const router = Router();

router.post('/', async (req:Request, res:Response) => {
  try {
    const { error } = validate(req.body);

    if (error)
      return res.status(400).json({ msg: 'Invalid username or password!' });

    const { username, password } = req.body;

    const admin = await Admin.findOne({ username }).select('username password');

    if (!admin)
      return res.status(400).json({ msg: 'Invalid username or password!' });

    if (!await bcrypt.compare(password, admin.password))
      return res.status(400).json({ msg: 'Invalid username or password!' });

    return res.header('x-auth-token', generateAuthToken(admin._id)).json({ msg: 'Successfully logged in!' });
  } catch (ex) {
    errorHandle('Authentication', res, ex);
  }
});

export default router;
