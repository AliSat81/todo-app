import Joi from 'joi';
import objectId from '../validate/custom.validation';
import { NewCreatedTask } from './task.interfaces';

const createTaskBody: Record<keyof NewCreatedTask, any> = {
  title: Joi.string().required(),
  description: Joi.string().optional(),
  status: Joi.string().required().valid('To Do', 'Doing', 'Done', 'Extra'),
  priorityTag: Joi.string().valid('Medium', 'High', 'Low'),
  trackTag: Joi.string().valid('On Track', 'Off Track', 'At Risk'),
  order: Joi.number().integer().optional(),
};

export const createTask = {
  body: Joi.object().keys(createTaskBody),
};

export const getTasks = {
  query: Joi.object().keys({
    title: Joi.string().optional(),
    status: Joi.string().optional().valid('To Do', 'Doing', 'Done', 'Extra'),
    priorityTag: Joi.string().optional().valid('Medium', 'High', 'Low'),
    trackTag: Joi.string().optional().valid('On Track', 'Off Track', 'At Risk'),
    sortBy: Joi.string().optional(),
    groupBy: Joi.string().optional(),
    limit: Joi.number().integer().optional(),
    page: Joi.number().integer().optional(),
  }),
};

export const getTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
};

export const updateTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      status: Joi.string().optional().valid('To Do', 'Doing', 'Done', 'Extra'),
      priorityTag: Joi.string().optional().valid('Medium', 'High', 'Low'),
      trackTag: Joi.string().optional().valid('On Track', 'Off Track', 'At Risk'),
      order: Joi.number().integer().optional(),
    })
    .min(1),
};

export const deleteTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
};

export const swapTasks = {
  body: Joi.object({
    ids: Joi.array().items(Joi.string().length(24).required()).length(2).required().messages({
      'array.base': '"ids" should be an array',
      'array.length': '"ids" should contain exactly 2 IDs',
      'string.base': '"ids" should contain valid string IDs',
      'string.empty': '"ids" should not be empty',
      'string.length': '"ids" should be a valid 24-character string',
    }),
  }),
};
