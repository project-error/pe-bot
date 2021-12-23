import EventEmitter from 'events';
import { EventClass } from '../utils/gitkraken/types';
import {
  BoardEmittedEvents,
  CardEmittedEvents,
  ColumnEmittedEvents,
  CommentEmittedEvents,
} from '../utils/gitkraken/emittedEvents';

class GitKrakenEmitter extends EventEmitter {}
class KofiEmitter extends EventEmitter {}

export const gitKrakenEmitter = new GitKrakenEmitter();
export const kofiEmitter = new KofiEmitter();

export function emitEventReducer(
  type: EventClass,
  rawAction: string,
  data: unknown
): void {
  switch (type) {
    case 'boards': {
      const action = BoardEmittedEvents[rawAction];
      if (action) gitKrakenEmitter.emit(action, data);
      break;
    }

    case 'cards': {
      const action = CardEmittedEvents[rawAction];
      if (action) gitKrakenEmitter.emit(action, data);
      break;
    }
    case 'columns': {
      const action = ColumnEmittedEvents[rawAction];
      if (action) gitKrakenEmitter.emit(action, data);
      break;
    }

    case 'comments': {
      const action = CommentEmittedEvents[rawAction];
      if (action) gitKrakenEmitter.emit(action, data);
      break;
    }
  }
}
