import dotenv from 'dotenv';
import path from 'path';
import log from '../utils/log';
import exit from '../utils/exit';

let config:any = {};

try {
  if (!process.env.NODE_ENV) exit({ label: 'Config', message: `Environment variable NODE_ENV is not set!` });

  const NODE_ENV = process.env.NODE_ENV;
  dotenv.config({ path: path.resolve(__dirname, `../config/${NODE_ENV}.env`) });

  const properties = ['APP_PORT'];

  properties.forEach((property:string) => {
    !process.env.hasOwnProperty(property)
      ? exit({ label: 'Config', message: `Environment variable ${property} is not set!` })
      : config.property = eval(`process.env.${property}`);
  });

  log.init({ label: 'Config', message: 'Config successfully initialized!' });

} catch (ex) {
  exit({ label: 'Config', message: `${ex}` });
}

export default config;
