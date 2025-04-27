import customAxios from './customAxios';

const API_URL = '/tasks'; // since baseURL is already http://localhost:5000/api

export const fetchTasks = async () => {
  const response = await customAxios.get(API_URL);
  return response.data;
};

export const addTask = async (task) => {
  const response = await customAxios.post(API_URL, task);
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await customAxios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await customAxios.put(`${API_URL}/${id}`, taskData);
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await customAxios.put(`${API_URL}/${id}/status`, { status });
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await customAxios.delete(`${API_URL}/${taskId}`);
  return response.data;
};
