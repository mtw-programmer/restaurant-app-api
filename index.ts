import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import './services/db';
import log from './utils/log';
import config from './utils/config';

import docs from './docs';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: config.REQ_DOMAIN,
  credentials: true,
  exposedHeaders: 'x-auth-token'
}));

app.use('/api', routes);
app.use(docs);

const port = config.APP_PORT || 3001;
export default app.listen(port, () => log.init({ label: 'Index', message: `App listening on port ${port}` }));
