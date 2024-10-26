import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { taskController, taskValidation } from '../../modules/task';

const router: Router = express.Router();

router
  .route('/')
  .post(validate(taskValidation.createTask), taskController.createTask)
  .get(validate(taskValidation.getTasks), taskController.getTasks);

router.route('/swap').patch(validate(taskValidation.swapTasks), taskController.swapTasks);

router
  .route('/:taskId')
  .get(validate(taskValidation.getTask), taskController.getTask)
  .patch(validate(taskValidation.updateTask), taskController.updateTask)
  .delete(validate(taskValidation.deleteTask), taskController.deleteTask);

export default router;

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     description: User can create todo tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ['To Do', 'Doing', 'Done', 'Extra']
 *               priorityTag:
 *                 type: string
 *                 enum: ['Medium', 'High', 'Low']
 *               trackTag:
 *                 type: string
 *                 enum: ['On Track', 'Off Track', 'At Risk']
 *               order:
 *                 type: integer
 *             example:
 *               title: "Design Homepage"
 *               description: "Design the homepage for the new project."
 *               status: "Doing"
 *               priorityTag: "High"
 *               trackTag: "On Track"
 *               order: 1
 *     responses:
 *       "201":
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       "400":
 *         $ref: '#/components/responses/InvalidTaskData'
 *
 *   get:
 *     summary: Get all tasks
 *     description: Admins can retrieve all tasks for the project.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Task status
 *       - in: query
 *         name: priorityTag
 *         schema:
 *           type: string
 *         description: Task priority
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by query in the form of field:desc/asc (ex. title:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of tasks
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 2
 *                 totalResults:
 *                   type: integer
 *                   example: 20
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 * /tasks/{id}:
 *   get:
 *     summary: Get a task
 *     description: Logged in users can fetch their own task information. Admins can fetch any task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a task
 *     description: Logged in users can update their own tasks. Admins can update any task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ['To Do', 'Doing', 'Done', 'Extra']
 *               priorityTag:
 *                 type: string
 *                 enum: ['Medium', 'High', 'Low']
 *               trackTag:
 *                 type: string
 *                 enum: ['On Track', 'Off Track', 'At Risk']
 *               order:
 *                 type: integer
 *             example:
 *               title: "Update Homepage"
 *               description: "Update the homepage design."
 *               status: "Doing"
 *               priorityTag: "Medium"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       "400":
 *         $ref: '#/components/responses/InvalidTaskData'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a task
 *     description: Logged in users can delete their own tasks. Admins can delete any task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task id
 *     responses:
 *       "200":
 *         description: Task deleted
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
