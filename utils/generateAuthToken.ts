import { ObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';

import config from '../utils/config';

export default (id:ObjectId) => jwt.sign(`${id}`, config.TOKEN_SECRET);
