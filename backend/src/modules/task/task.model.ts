import mongoose, { Model } from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { ITaskDoc, ITaskModel } from './task.interfaces';

const taskSchema = new mongoose.Schema<ITaskDoc, ITaskModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      enum: ['To Do', 'Doing', 'Done', 'Extra'],
      default: 'To Do',
      required: true,
    },
    priorityTag: {
      type: String,
      enum: ['Medium', 'High', 'Low'],
      required: false,
    },
    trackTag: {
      type: String,
      enum: ['On Track', 'Off Track', 'At Risk'],
      required: false,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to set the order based on the total count
taskSchema.pre<ITaskDoc>('save', async function (next) {
  const taskModel = this.constructor as Model<ITaskDoc>;

  if (this.isNew) {
    const totalTasks = await taskModel.countDocuments({ isDeleted: false }).exec();
    this.order = totalTasks + 1;
  }
  next();
});

// Add plugins that convert mongoose to JSON and paginate
taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);

// Create the Task model
const Task = mongoose.model<ITaskDoc, ITaskModel>('Task', taskSchema);

export default Task;
