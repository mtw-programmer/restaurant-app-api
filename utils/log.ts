import winston from 'winston';

import dotenv from 'dotenv';
dotenv.config({ path: `../config/${process.env.NODE_ENV}.env` });

const { combine, timestamp, printf } = winston.format;

const timezone = () => {
  return `(${new Date().toLocaleString('pl', {
      timeZone: process.env.TZ ? process.env.TZ : 'Europe/Warsaw',
  })})`;
}

const logFormat = printf(({timestamp, level, label, message}) => {
  return `[${level.toUpperCase()}] ${timestamp}: [${label}] - ${message}`;
});

const debug = winston.createLogger({
  levels: {
    'debug': 0,
  },
  format: combine(
    timestamp({ format: timezone }),
    logFormat,
  ),
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
  ]
});

const request = winston.createLogger({
  levels: {
    'request': 1,
  },
  format: combine(
    timestamp({ format: timezone }),
    logFormat,
  ),
  transports: [
    new (winston.transports.File)({ 
      filename: `log/request.log`, 
      level: 'request',
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
  exitOnError: true,
});

const info = winston.createLogger({
  levels: {
    'info': 2,
  },
  format: combine(
    timestamp({ format: timezone }),
    logFormat,
  ),
  transports: [
    new (winston.transports.File)({ filename: `log/info.log`, level: 'info'}),
    new (winston.transports.Console)({ level: 'info' }),
  ]
});

const init = winston.createLogger({
  levels: {
    'init': 3,
  },
  format: combine(
    timestamp({ format: timezone }),
    logFormat,
  ),
  transports: [
    new (winston.transports.Console)({ level: 'init' }),
  ]
});

const warn = winston.createLogger({
  levels: {
    'warn': 4,
  },
  format: combine(
    timestamp({ format: timezone }),
    logFormat,
  ),
  transports: [
    new (winston.transports.File)({ 
      filename: `log/warn.log`, 
      level: 'warn',
      handleExceptions: true,
      handleRejections: true,
    }),
    new (winston.transports.Console)({ 
      level: 'warn',
      handleExceptions: true,
      handleRejections: true,
     }),
  ],
  exitOnError: true,
});

const error = winston.createLogger({
  levels: {
    'error': 5,
  },
  format: combine(
    timestamp({ format: timezone }),
    logFormat,
  ),
  transports: [
    new (winston.transports.File)({ 
      filename: `log/error.log`, 
      level: 'error',
      handleExceptions: true,
      handleRejections: true,
    }),
    new (winston.transports.Console)({ 
      level: 'error',
      handleExceptions: true,
      handleRejections: true,
     }),
  ],
  exitOnError: true,
});

export default {
  init: ({ label, message }) => {
    if(process.env.NODE_ENV !== 'test')
      init.log({ level: 'init', label, message });
  },
  debug: ({ label, message }) => {
    debug.debug({ label, message });
  },
  request: ({ label, message }) => {
    if(process.env.NODE_ENV !== 'test')
      request.log({ level: 'request', label, message });
  },
  info: ({ label, message }) => {
    if(process.env.NODE_ENV !== 'test')
      info.info({ label, message });
  },
  warn: ({ label, message }) => {
    if(process.env.NODE_ENV !== 'test')
      warn.warn({ label, message });
  },
  error: ({ label, message }) => {
    error.error({ label, message });
  },
};
