import { Model, Document } from 'mongoose';
import { QueryResult, IOptions } from './paginate';

// Use generics for document and model interfaces
export interface IModel<T extends Document> extends Model<T> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult>;
}
