import { Doc } from '../../modules/data/models'

export const TYPE_TODO = 'todo';

export class Todo extends Doc {
  title?: string;
  note?: string;
  done?: boolean;

  tags?: string[];
}