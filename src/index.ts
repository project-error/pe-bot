import dotenv from 'dotenv';
import PEBot from './client/PEBot';
import path from 'path';

if (process.env.NODE_ENV === 'development') {
  const env = dotenv.config({ path: path.resolve('.env.dev') });
} else {
  dotenv.config();
}

const peBot = new PEBot();

peBot.start();
