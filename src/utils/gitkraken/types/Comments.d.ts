import { CardShallow } from './Cards';
import { BaseEvent } from './Misc';

export interface Comment {
  id: string;
  text: string;
  created_date: Date;
  created_by: {
    id: string;
  };
}

export interface CommentWithPrevious extends Comment {
  previous: Comment;
}

export interface CommentAdd extends BaseEvent {
  action: 'added';
  card: CardShallow;
  comment: Comment;
}

export interface CommentUpdated extends BaseEvent {
  action: 'updated';
  card: CardShallow;
  comment: CommentWithPrevious;
}

export interface CommentDeleted extends BaseEvent {
  card: CardShallow;
  comment: Comment;
}
