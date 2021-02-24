import '../utils/dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import gitKrakenRoutes from './webhook';
import { Logger } from 'tslog';
import morgan from 'morgan';

const tempLogger = new Logger();

const port = process.env.EXPRESS_PORT ?? 1500;
const app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(gitKrakenRoutes);

app.listen(port, () => {
  tempLogger.info(`Express server started on port ${port}`);
});
