import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path:
    process.env.NODE_ENV === 'development'
      ? path.resolve(__dirname, '../../.env.dev')
      : path.resolve(__dirname, '../../.env'),
});
