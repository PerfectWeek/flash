import express from 'express';
import morgan from 'morgan';

import router from './api/routes/router';

const app = express();

app.use(morgan('dev'));

app.use(router);

app.get('/', (req, res) => res.status(200).send('Flash API du swag (prepare for lightspeed)'));

export default app;
