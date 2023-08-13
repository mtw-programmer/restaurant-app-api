import dotenv from 'dotenv';
import path from 'path';
import log from '../utils/log';
import exit from './errorHandling/exit';

const config = process.env;

try {
  if (!config.NODE_ENV) exit({ label: 'Config', message: 'Environment variable NODE_ENV is not set!' });

  const NODE_ENV = config.NODE_ENV;
  dotenv.config({ path: path.resolve(__dirname, `../config/${NODE_ENV}.env`) });

  const properties = ['APP_PORT', 'REQ_DOMAIN', 'DB_HOST', 'DB_NAME', 'DB_PORT', 'SERVER_DOMAIN'];

  properties.forEach((property:string) => {
    !process.env.hasOwnProperty(property)
      ? exit({ label: 'Config', message: `Environment variable ${property} is not set!` })
      : config.property = eval(`config.${property}`);
  });

  log.init({ label: 'Config', message: 'Config successfully initialized!' });

} catch (ex) {
  exit({ label: 'Config', message: `${ex}` });
}

export default config;
