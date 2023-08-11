import mongoose from 'mongoose';
import config from '../utils/config';
import log from '../utils/log';

mongoose.connect(`mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`)
  .then(() => log.init({ label: 'DB', message: `Connected to ${config.DB_NAME} database on port ${config.DB_PORT}` }))
  .catch((ex) => log.error({ label: 'DB', message: ex }));
