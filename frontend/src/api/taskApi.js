import axios from 'axios';

// Set the base URL for API
const API_URL = 'http://localhost:5000/api/tasks'; // Update with your actual backend URL

// Fetch all tasks
export const fetchTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching tasks');
  }
};

// Add a new task
export const addTask = async (task) => {
  try {
    const response = await axios.post(API_URL, task);
    return response.data; // Return taskId or any relevant info from the response
  } catch (error) {
    throw new Error('Error adding task');
  }
};

// Get a single task by ID
export const getTaskById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching task by ID');
    }
  };
  
  // Update a task by ID
  export const updateTask = async (id, taskData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw new Error('Error updating task');
    }
  };
  // Just udpate status
  export const updateTaskStatus = async (id, status) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error('Error updating task status');
    }
  };
  // delete a task
  export const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`${API_URL}/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error; // Optionally, handle error here (e.g., display a message)
    }
  };
  