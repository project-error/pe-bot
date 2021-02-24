import { ILogObject, Logger } from 'tslog';
import fs from 'fs';
import { LOG_OUTPUT_PATH } from '../config';
import path from 'path';

export const getLogger = (): Logger => {
  const mainLogger: Logger = new Logger({
    name: 'PEBot',
    displayLoggerName: true,
  });

  function fileTransport(logObj: ILogObject) {
    const outDir = LOG_OUTPUT_PATH;

    const logOut = (logObj: ILogObject, type: 'error' | 'main' | 'debug') => {
      fs.appendFileSync(path.join(outDir, `${type}.log`), JSON.stringify(logObj) + '\n');
    };

    try {
      !fs.existsSync(outDir) && fs.mkdirSync(outDir);
    } catch (e) {
      mainLogger.error(e);
    }

    switch (logObj.logLevel) {
      case 'debug':
        logOut(logObj, 'debug');
        break;
      case 'error':
        logOut(logObj, 'error');
        break;
      case 'fatal':
        logOut(logObj, 'error');
        break;
      case 'info':
        logOut(logObj, 'main');
        break;
      case 'trace':
        logOut(logObj, 'debug');
        break;
      case 'warn':
        logOut(logObj, 'main');
    }
  }

  mainLogger.attachTransport({
    error: fileTransport,
    silly: fileTransport,
    debug: fileTransport,
    trace: fileTransport,
    info: fileTransport,
    warn: fileTransport,
    fatal: fileTransport,
  });

  return mainLogger;
};
