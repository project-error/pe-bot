import { Board } from './Boards';
import { BaseEvent, Label, User } from './Misc';

export interface Card {
  id: string;
  name: string;
  created_date: string;
  board_id: string;
  column_id: string;
  labels: [];
  assignees: [];
  completed_task_count: 0;
  total_task_count: 0;
  attachment_count: 0;
  comment_count: 0;
  permanent_id: string;
  description: {
    text?: string;
  };
  created_by: {
    id: string;
  };
}

interface CardShallow {
  id: string;
  name: string;
}

export interface CardWithPrevious extends Card {
  previous: {
    id: string;
    name: string;
    description: string;
  };
}

export interface CardAdded extends BaseEvent {
  action: 'added';
  card: Card;
}

export interface CardUpdated extends BaseEvent {
  action: 'updated';
  card: CardWithPrevious;
}

export interface CardCopied extends BaseEvent {
  action: 'copied';
  card: Card;
}

export interface CardArchived extends BaseEvent {
  action: 'archived';
  card: CardShallow;
}

export interface CardUnarchived extends BaseEvent {
  action: 'unarchived';
  card: CardShallow;
}

export interface CardDeleted extends BaseEvent {
  action: 'deleted';
  card: Card;
}

export interface CardReordered extends BaseEvent {
  action: 'reordered';
  card: Card;
  position: number;
}

export interface CardMovedColumns extends BaseEvent {
  action: 'moved_column';
  card: Card;
  position: number;
}

export interface CardMovedToBoard extends BaseEvent {
  action: 'moved_to_board';
  new_card: {
    id: string;
    board_id: string;
  };
  card: Card;
  position: number;
}

export interface CardLabelsUpdated extends BaseEvent {
  action: 'labels_updated';
  card: CardShallow;
  labels: {
    added: Label[];
    removed: Label[];
  };
}

export interface CardAssigneesUpdated extends BaseEvent {
  action: 'assignees_updated';
  card: CardShallow;
  assignees: {
    added: User[];
    removed: User[];
  };
}
