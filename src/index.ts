require('./utils/dotenv');
import 'reflect-metadata';
import PEBot from './client/PEBot';
import './express/init';

const peBot = new PEBot();

peBot.start().catch(e => console.error(e));