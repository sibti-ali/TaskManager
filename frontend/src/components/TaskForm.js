// src/pages/TaskForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addTask, getTaskById, updateTask } from '../api/taskApi'; // Import the necessary API functions
import { FaSave, FaPlusCircle } from 'react-icons/fa';
import '../styling/TaskForm.css';


export default function TaskForm() {
	const { taskId } = useParams();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [dueDate, setDueDate] = useState('');
	const [status, setStatus] = useState('pending');
	const navigate = useNavigate();
	const isEditMode = !!taskId; // Check if we're in edit mode (i.e., taskId exists)

	// Fetch task details when editing
	useEffect(() => {
		if (isEditMode) {
			getTaskById(taskId).then((task) => {
				if (task) {
					setTitle(task.title);
					setDescription(task.description);
					setDueDate(task.dueDate?.substring(0, 10)); // Remove time from dueDate if present
					setStatus(task.status);
				}
			});
		}
	}, [taskId, isEditMode]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const taskData = { title, description, dueDate, status };

		try {
			if (isEditMode) {
				await updateTask(taskId, taskData); // Update the task
			} else {
				await addTask(taskData); // Create a new task
			}
			navigate('/'); // Redirect to home page after submission
		} catch (error) {
			console.error(`${isEditMode ? 'Update' : 'Create'} failed:`, error);
		}
	};

	return (
		<div className="container task-form-container mt-5 mb-5 p-4 shadow-sm bg-light rounded">
			<h1 className="mb-4 display-6">
				{isEditMode ? 'Update Task' : 'Create a New Task'}
			</h1>
			<form onSubmit={handleSubmit} className="needs-validation" noValidate>
				{/* Title */}
				<div className="mb-3">
					<label htmlFor="title" className="form-label">Title</label>
					<input
						type="text"
						id="title"
						className="form-control"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>

				{/* Description */}
				<div className="mb-3">
					<label htmlFor="description" className="form-label">Description</label>
					<textarea
						id="description"
						className="form-control"
						rows="3"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>

				{/* Due Date */}
				<div className="mb-3">
					<label htmlFor="dueDate" className="form-label">Due Date</label>
					<input
						type="date"
						id="dueDate"
						className="form-control"
						value={dueDate}
						onChange={(e) => setDueDate(e.target.value)}
						required
					/>
				</div>

				{/* Status */}
				<div className="mb-4">
					<label htmlFor="status" className="form-label">Status</label>
					<select
						id="status"
						className="form-select"
						value={status}
						onChange={(e) => setStatus(e.target.value)}
					>
						<option value="pending">Pending</option>
						<option value="committed">Committed</option>
						<option value="completed">Completed</option>
					</select>
				</div>

				{/* Submit Button */}
				<button type="submit" className="btn btn-success d-flex align-items-center gap-2">
					{isEditMode ? <FaSave /> : <FaPlusCircle />}
					{isEditMode ? 'Update Task' : 'Create Task'}
				</button>
			</form>
		</div>
	);
}