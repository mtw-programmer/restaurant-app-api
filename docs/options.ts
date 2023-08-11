import config from '../utils/config';

export default {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant App API',
      version: '1.0.0',
      description: 'API for Restaurant Web App'
    },
  },
  servers: [
    {
      url: config.SERVER_DOMAIN
    }
  ],
  apis: ['./docs/*.yaml', './docs/**/*.yaml']
};