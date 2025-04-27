// src/pages/TaskForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addTask, getTaskById, updateTask } from '../api/taskApi';
import { FaSave, FaPlusCircle } from 'react-icons/fa';
import { Editor } from 'primereact/editor';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TaskForm() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(taskId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending',
  });

  useEffect(() => {
	if (isEditMode) {
	  const fetchTask = async () => {
		try {
		  const task = await getTaskById(taskId);
		  if (task) {
			setFormData({
			  title: task.title || '',
			  description: task.description || '',
			  dueDate: task.dueDate?.substring(0, 10) || '',
			  status: task.status || 'pending',
			});
		  }
		} catch (error) {
		  // Redirect to ErrorPage with error details
		  navigate('/error', {
			state: {
			  errorDetails: {
				message: error.message,
				status: error.response?.status || 'Unknown',
				data: error.response?.data || {},
			  },
			},
		  });
		}
	  };
  
	  fetchTask();
	}
  }, [taskId, isEditMode, navigate]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (e) => {
    setFormData(prev => ({ ...prev, description: e.htmlValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateTask(taskId, formData);
      } else {
        await addTask(formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-body">
          <h1 className="text-center mb-4">{isEditMode ? 'Update Task' : 'Create Task'}</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <Editor
                value={formData.description}
                onTextChange={handleEditorChange}
                style={{ height: '200px' }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dueDate" className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="committed">Committed</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success w-100">
              {isEditMode ? <FaSave className="me-2" /> : <FaPlusCircle className="me-2" />}
              {isEditMode ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
