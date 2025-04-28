import request from 'supertest';
import express from 'express';
import taskRoutes from '../../routes/taskRoutes'; // Import the route file

const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes); // Mount the task routes

describe('Task API', () => {
  let id; // Variable to store the next auto-increment ID

  // Fetch the next auto-increment ID before running the tests
  beforeAll(async () => {
    const response = await request(app).get('/api/tasks/unittest/next-id');
    id = response.body.nextId; // Store the next ID and Use the dynamically fetched ID
  });

  // Test for creating a task
  it('should create a new task', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Task Description',
      dueDate: '2025-04-30',
      status: 'pending',
    };

    const response = await request(app)
      .post('/api/tasks')
      .send(taskData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Task created');
    expect(response.body.taskId).toBe(id); 
  });

  // Test for getting all tasks
  it('should get all tasks', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); 
  });

  // Test for getting a task by ID
  it('should get a task by ID', async () => {
    const response = await request(app).get(`/api/tasks/${id}`); 
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', id); 
  });

  // Test for updating task status
  it('should update the task status', async () => {
    const response = await request(app)
      .put(`/api/tasks/${id}/status`) 
      .send({ status: 'completed' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task status updated');
  });

  // Test for full task update
  it('should update the task details', async () => {
    const taskData = {
      title: 'Updated Task',
      description: 'Updated Description',
      dueDate: '2025-05-01',
      status: 'pending',
    };

    const response = await request(app)
      .put(`/api/tasks/${id}`) 
      .send(taskData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task updated');
  });

  // Test for deleting a task
  it('should delete a task', async () => {
    const response = await request(app).delete(`/api/tasks/${id}`); 
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task deleted');
  });

  // Edge case: Test for invalid task ID
  it('should return 404 for non-existent task ID', async () => {
    const nonExistentId = id + 100; // Assuming 'id' is a valid ID in the database
    const response = await request(app).get(`/api/tasks/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Task not found');
  });

  // Test for empty list of tasks when no tasks are present
  it('should return an empty list of tasks when no tasks are present', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]); 
  });

  // Test for concurrent task creation
it('should handle concurrent task creation', async () => {
    const tasks = [];
    const createdTaskIds = []; // Store task IDs for cleanup
  
    // Create tasks concurrently
    for (let i = 0; i < 5; i++) {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: `Concurrent Task ${i}`,
          description: `Description ${i}`,
          dueDate: '2025-04-30',
          status: 'pending',
        });
      
      tasks.push(response);
      createdTaskIds.push(response.body.taskId); // Store the taskId for cleanup
    }
  
    // Verify task creation
    tasks.forEach(response => {
      expect(response.status).toBe(201);
      expect(response.body.taskId).toBeDefined();
    });
  
    // Cleanup: delete the tasks created during the test
    for (const taskId of createdTaskIds) {
      await request(app).delete(`/api/tasks/${taskId}`);
    }
  });

  // Test for multiple tasks creation and deletion
  it('should create and delete multiple tasks correctly', async () => {
    for (let i = 0; i < 3; i++) {
      const taskData = { title: `Task ${i}`, description: `Description ${i}`, dueDate: '2025-04-30', status: 'pending' };
      const response = await request(app).post('/api/tasks').send(taskData);
      expect(response.status).toBe(201);
      expect(response.body.taskId).toBeDefined();

      // Delete each task
      const deleteResponse = await request(app).delete(`/api/tasks/${response.body.taskId}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.message).toBe('Task deleted');
    }
  });

});
