import { ConnectionManager } from 'typeorm';
import { Ban } from './models/Ban';
import { Warning } from './models/Warning';
import { Kick } from './models/Kick';

const connectManager = new ConnectionManager();

connectManager.create({
  entities: [Ban, Warning, Kick],
  type: 'postgres',
  database: 'pe-bot',
  host: process.env.DB_HOSTNAME,
  port: parseInt(process.env.DB_PORT as string) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'devlocal',
});

export default connectManager;
