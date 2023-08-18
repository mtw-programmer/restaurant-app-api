import { ObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';

import config from '../utils/config';

export default (id:ObjectId) => jwt.sign({ id: `${id}` }, config.TOKEN_SECRET, { expiresIn: config.TOKEN_EXPIRATION });
