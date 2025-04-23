import React, { useEffect, useState } from 'react';
import { fetchTasks } from '../api/taskApi';
import TaskTable from '../components/TaskTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styling/Common.css';

export default function Home() {
	const [tasks, setTasks] = useState([]);
	const [search, setSearch] = useState('');

	useEffect(() => {
		const loadTasks = async () => {
			try {
				const response = await fetchTasks();
				if (Array.isArray(response)) {
					setTasks(response);
				} else {
					console.error('Tasks data is not an array');
				}
			} catch (error) {
				console.error('Failed to fetch tasks:', error);
			}
		};
		loadTasks();
	}, []);

	// Filter tasks based on search query
	const filteredTasks = tasks.filter(task =>
		task.title.toLowerCase().includes(search.toLowerCase()) ||
		task.description.toLowerCase().includes(search.toLowerCase()) ||
		task.id === search
	);

	return (

		<>
			<div className="mb-3">
				<label htmlFor="taskSearch" className="form-label">Search tasks</label>
				<input
					id="taskSearch"
					className="form-control"
					type="text"
					placeholder="Search tasks by id or title or description..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					aria-label="Search tasks"
				/>
			</div>

			<TaskTable tasks={filteredTasks} />
		</>
	);
}
