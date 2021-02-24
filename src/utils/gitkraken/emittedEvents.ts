type EmittedEvents = { [index: string]: string };

export const CardEmittedEvents: EmittedEvents = {
  added: 'cardAdded',
  archived: 'cardArchived',
  unarchived: 'cardUnarchived',
  deleted: 'cardDeleted',
  copied: 'cardCopied',
  reordered: 'cardReordered',
  moved_column: 'cardMovedColumn',
  moved_to_board: 'cardMovedToBoard',
  labels_updated: 'cardLabledsUpdated',
  assignees_updated: 'cardAssigneesUpdated',
};

export const BoardEmittedEvents: EmittedEvents = {
  archived: 'boardArchived',
  unarchived: 'boardUnarchived',
  deleted: 'boardDeleted',
  labels_updated: 'boardLabelUpdated',
  members_updated: 'boardMembersUpdated',
};

export const ColumnEmittedEvents: EmittedEvents = {
  added: 'columnAdded',
  updated: 'columnUpdated',
  reordered: 'columnReordered',
  archived: 'columnArchived',
  unarchived: 'columnUnarchived',
  deleted: 'columnDeleted',
};

export const CommentEmittedEvents: EmittedEvents = {
  added: 'commentAdded',
  updated: 'commentUpdated',
  deleted: 'commentDeleted',
};
