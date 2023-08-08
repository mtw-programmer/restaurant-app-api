import dotenv from 'dotenv';
import log from '../utils/log';

const NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config({ path: `config/${NODE_ENV}.env` });

log.init({ label: 'Config', message: 'Config successfully initialized' });
