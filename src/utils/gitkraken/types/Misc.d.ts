import { Board } from './Boards';

export type EventClass = 'boards' | 'columns' | 'cards' | 'comments';

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface BaseEvent {
  action: string;
  board: Board;
  sender: User;
  sequence: number;
}

export interface User {
  name: string;
  id: string;
  username: string;
}

export interface Label {
  id: string;
  name: string;
  color: RGBA;
}

export enum cardEventEnums {
  added = 'cardAdded',
  updated = 'cardUpdated',
  archived = 'cardArchived',
  unarchived = 'cardUnarchived',
  deleted = 'cardDeleted',
  copied = 'cardCopied',
  reordered = 'cardReordered',
  moved_column = 'cardMovedColumn',
  moved_to_board = 'cardMovedToBoard',
  labels_updated = 'cardLabledsUpdated',
  assignees_updated = 'cardAssigneesUpdated',
}
