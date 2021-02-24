import { BaseEvent } from './Misc';

export interface Column extends ShallowColumn {
  ['created_date']: Date;
  ['created_by']: {
    id: string;
  };
}

export interface ShallowColumn {
  id: string;
  name: string;
}

interface ColumnWithPrevious extends ShallowColumn {
  previous: ShallowColumn;
}

interface ColumnAdded extends BaseEvent {
  action: 'added';
  column: Column;
}

interface ColumnUpdated extends BaseEvent {
  action: 'updated';
  column: ColumnWithPrevious;
}

interface ColumnReordered extends BaseEvent {
  action: 'reordered';
  column: Column;
  position: number;
}

interface ColumnArchived extends BaseEvent {
  action: 'archived';
  column: Column;
}

interface ColumnUnarchived extends BaseEvent {
  action: 'unarchived';
  column: Column;
}

interface ColumnDeleted extends BaseEvent {
  action: 'deleted';
  column: Column;
}
