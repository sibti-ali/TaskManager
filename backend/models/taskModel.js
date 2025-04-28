import db from '../config/db.js';

// Create a new task
export async function createTask({ title, description, dueDate, status = 'pending' }) {
  const [result] = await db.execute(
    `INSERT INTO tasks (title, description, dueDate, status)
     VALUES (?, ?, ?, ?)`,
    [title, description || null, dueDate, status]
  );
  return result.insertId;
}

// Get all tasks
export async function getAllTasks() {
  const [rows] = await db.execute(`SELECT * FROM tasks`);
  return rows;
}

// Get a task by ID
export async function getTaskById(id) {
  const [rows] = await db.execute(`SELECT * FROM tasks WHERE id = ?`, [id]);
  return rows[0]; // return single task object or undefined
}

// Update task status only
export async function updateTaskStatus(id, status) {
  const [result] = await db.execute(
    `UPDATE tasks SET status = ? WHERE id = ?`,
    [status, id]
  );
  return result.affectedRows > 0;
}

// Full task update
export async function updateTaskById(id, { title, description, dueDate, status }) {
  const [result] = await db.execute(
    `UPDATE tasks 
     SET title = ?, description = ?, dueDate = ?, status = ?
     WHERE id = ?`,
    [title, description || null, dueDate, status, id]
  );
  return result.affectedRows > 0;
}


// Delete a task
export async function deleteTask(id) {
  const [result] = await db.execute(`DELETE FROM tasks WHERE id = ?`, [id]);
  return result.affectedRows > 0;
}

export async function nextId() {
  const [rows] = await db.execute('SHOW TABLE STATUS LIKE "tasks"');
  const nextId = rows[0].Auto_increment;
  return nextId;
}
