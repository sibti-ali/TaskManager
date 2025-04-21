import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskById,
  updateTaskStatus,
  deleteTask,
} from '../models/taskModel.js';

const router = express.Router();

// Create a new task
router.post('/', async (req, res) => {
  try {
    const taskId = await createTask(req.body);
    res.status(201).json({ message: 'Task created', taskId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task', details: error.message });
  }
});

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks); // ✅ just return the array
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
  }
});


// Get a single task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (task) res.status(200).json(task);
    else res.status(404).json({ error: 'Task not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task', details: error.message });
  }
});

// Update task status
router.put('/:id/status', async (req, res) => {
  try {
    const updated = await updateTaskStatus(req.params.id, req.body.status);
    if (updated) res.status(200).json({ message: 'Task status updated' });
    else res.status(404).json({ error: 'Task not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task status', details: error.message });
  }
});

// Update full task
router.put('/:id', async (req, res) => {
  try {
    const updated = await updateTaskById(req.params.id, req.body);
    if (updated) res.status(200).json({ message: 'Task updated' });
    else res.status(404).json({ error: 'Task not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task', details: error.message });
  }
});

// Delete a task
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