import { Router } from 'express';

import config from '../utils/config';
import options from './options';

import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const specs = swaggerJSDoc(options);

const router = Router();

if (config.NODE_ENV === 'development') {
  router.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));
}

export default router;
