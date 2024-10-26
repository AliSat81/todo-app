import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedTask, UpdateTaskBody, ITaskDoc } from './task.interfaces';
import Task from './task.model';

/**
 * Create a task
 * @param {NewCreatedTask} task
 * @returns {Promise<ITaskDoc>}
 */
export const createTask = async (task: NewCreatedTask): Promise<ITaskDoc> => {
  return Task.create(task);
};

/**
 * Query for tasks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryTasks = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const tasks = await Task.paginate(filter, options);
  return tasks;
};

/**
 * Get task by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ITaskDoc | null>}
 */
export const getTaskById = async (id: mongoose.Types.ObjectId): Promise<ITaskDoc | null> => Task.findById(id);

/**
 * Update task by id
 * @param {mongoose.Types.ObjectId} taskId
 * @param {UpdateTaskBody} updateBody
 * @returns {Promise<ITaskDoc | null>}
 */
export const updateTaskById = async (
  taskId: mongoose.Types.ObjectId,
  updateBody: UpdateTaskBody
): Promise<ITaskDoc | null> => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  Object.assign(task, updateBody);
  await task.save();
  return task;
};

/**
 * Delete task by id
 * @param {mongoose.Types.ObjectId} taskId
 * @returns {Promise<ITaskDoc | null>}
 */
export const deleteTaskById = async (taskId: mongoose.Types.ObjectId): Promise<ITaskDoc | null> => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  // Soft delete a task
  const result = await Task.updateOne({ _id: taskId }, { $set: { isDeleted: true } });

  if (result?.modifiedCount === 0) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Task deletion failed: No task found or already deleted');
  }

  return task;
};

/**
 * Swap the order values of two tasks
 * @param {string[]} ids
 * @returns {Promise<{ message: string }>}
 */
export const swapTasks = async (ids: string[]): Promise<{ message: string }> => {
  const [taskId1, taskId2] = ids;

  const task1 = await Task.findById(taskId1);
  const task2 = await Task.findById(taskId2);

  if (!task1 || !task2) {
    throw new ApiError(httpStatus.NOT_FOUND, 'One or both tasks not found');
  }

  const tempOrder = task1.order;
  task1.order = task2.order;
  task2.order = tempOrder;

  await Promise.all([task1.save(), task2.save()]);

  return {
    message: 'Tasks swapped successfully',
  };
};
