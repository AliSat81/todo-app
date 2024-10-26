import { Model, Document } from 'mongoose';
import { QueryResult, IOptions } from '../paginate/paginate';

// The interface for the Task
export interface ITask {
  title: string;
  description: string;
  status: 'To Do' | 'Doing' | 'Done' | 'Extra';
  priorityTag: 'Medium' | 'High' | 'Low';
  trackTag: 'On Track' | 'Off Track' | 'At Risk';
  order: number;
  isDeleted: boolean;
}

// The document interface which extends ITask and Document from mongoose
export interface ITaskDoc extends ITask, Document {}

// The model interface extending Model from mongoose
export interface ITaskModel extends Model<ITaskDoc> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult>;
}

// Types for creating and updating tasks
export type UpdateTaskBody = Partial<ITask>;
export type NewCreatedTask = Pick<ITask, 'title' | 'status'> & {
  priorityTag?: 'Medium' | 'High' | 'Low';
  trackTag?: 'On Track' | 'Off Track' | 'At Risk';
  description?: string;
  order?: number;
};
