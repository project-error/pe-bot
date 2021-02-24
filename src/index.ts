require('./utils/dotenv');
import 'reflect-metadata';
import PEBot from './client/PEBot';
import { getLogger } from './utils/logger';
import './express/init';

const tempLog = getLogger();

const peBot = new PEBot();

peBot.start().catch((e) => tempLog.error(e));
