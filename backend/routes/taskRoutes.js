import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskById,
  updateTaskStatus,
  deleteTask,
  nextId,
} from '../models/taskModel.js';

const router = express.Router();

// Validation and Sanitization Middlewares
const validateTask = [
  body('title')
    .trim()
    .escape()
    .notEmpty().withMessage('Title is required'),

  body('description')
    .optional()
    .trim(),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date (YYYY-MM-DD)')
    .toDate(),

  body('status')
    .optional()
    .trim()
    .escape()
];

// Helper function to check validation result
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * components:
 *   schemas:
 *     tasks:
 *       type: object
 *       required:
 *         - title
 *         - status
 *         - dueDate
 *       properties:
 *         id:
 *           type: integer
 *           SQL DataType: INT 
 *           description: The task ID based on Auto increment inside mysql (does not need to be passed)
 *         title:
 *           type: string
 *           SQL DataType: VARCHAR(255)
 *           description: The title of the task
 *         description:
 *           type: string
 *           SQL DataType: TEXT
 *           default: NULL
 *           description: A brief description of the task
 *         dueDate:
 *           type: string
 *           format: date-time
 *           SQL DataType: DATETIME
 *           description: The due date of the task
 *         status:
 *           type: string
 *           SQL DataType: ENUM('pending', 'committed', 'completed')
 *           default: pending
 *           description: The status of the task (pending,committed,completed)
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task created
 *                 taskId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/', validateTask, handleValidationErrors, async (req, res) => {
  try {
    const taskId = await createTask(req.body);
    res.status(201).json({ message: 'Task created', taskId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task', details: error.message });
  }
});

/**
 * @swagger
 * /tasks/unittest/next-id:
 *   get:
 *     summary: Get the next auto-increment ID for task
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: The next auto-increment ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nextId:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Internal server error
 */
router.get('/unittest/next-id', async (req, res) => {
  try {
    const nextID = await nextId();
    res.status(200).json({ nextId: nextID });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch next ID', details: error.message });
  }
});

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     responses:
 *       200:
 *         description: A task object
 *         content:
 *           application/json:
 *             schema:
 *               
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (task) res.status(200).json(task);
    else res.status(404).json({ error: 'Task not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task', details: error.message });
  }
});

/**
 * @swagger
 * /tasks/{id}/status:
 *   put:
 *     summary: Update task status
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the task
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id/status', 
  body('status').trim().escape(), 
  handleValidationErrors,
  async (req, res) => {
    try {
      const updated = await updateTaskStatus(req.params.id, req.body.status);
      if (updated) res.status(200).json({ message: 'Task status updated' });
      else res.status(404).json({ error: 'Task not found' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task status', details: error.message });
    }
  }
);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', validateTask, handleValidationErrors, async (req, res) => {
  try {
    const updated = await updateTaskById(req.params.id, req.body);
    if (updated) res.status(200).json({ message: 'Task updated' });
    else res.status(404).json({ error: 'Task not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task', details: error.message });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteTask(req.params.id);
    if (deleted) res.status(200).json({ message: 'Task deleted' });
    else res.status(404).json({ error: 'Task not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task', details: error.message });
  }
});

export default router;