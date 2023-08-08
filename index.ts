import express from 'express';
import log from './utils/log';
import './utils/config';

const app = express();

app.use(express.json());

const port = process.env.PORT || 3001;
app.listen(port, () => log.init({ label: 'Index', message: `App listening on port ${port}` }));
