import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as taskService from './task.service';

export const createTask = catchAsync(async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.body);
  res.status(httpStatus.CREATED).send(task);
});

export const getTasks = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy', 'groupBy']);
  const result = await taskService.queryTasks({ isDeleted: false }, options);
  res.send(result);
});

export const getTask = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['taskId'] === 'string') {
    const task = await taskService.getTaskById(new mongoose.Types.ObjectId(req.params['taskId']));
    if (!task) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
    }
    res.send(task);
  }
});

export const updateTask = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['taskId'] === 'string') {
    const task = await taskService.updateTaskById(new mongoose.Types.ObjectId(req.params['taskId']), req.body);
    res.send(task);
  }
});

export const deleteTask = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['taskId'] === 'string') {
    await taskService.deleteTaskById(new mongoose.Types.ObjectId(req.params['taskId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});

export const swapTasks = catchAsync(async (req: Request, res: Response) => {
  const result = await taskService.swapTasks(req.body.ids);

  return res.status(httpStatus.OK).send(result);
});
