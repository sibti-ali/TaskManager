import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSort, FaSortUp, FaSortDown, FaTrash } from 'react-icons/fa';
import { updateTaskStatus, deleteTask } from '../api/taskApi';
import DOMPurify from 'dompurify';
import '../styling/TaskTable.css';
import '../styling/Common.css';

export default function TaskTable({ tasks: initialTasks }) {
	const navigate = useNavigate();
	const [tasks, setTasks] = useState(initialTasks);
	const [activeTab, setActiveTab] = useState('pending');
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
	const [toastMessage, setToastMessage] = useState('');

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const tasksPerPage = 5;

	useEffect(() => {
		setTasks(initialTasks);
	}, [initialTasks]);

	const handleRowClick = (id) => navigate(`/edit/${id}`);

	const handleSort = (columnKey) => {
		let direction = 'asc';
		if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key: columnKey, direction });
	};

	const getSortIcon = (columnKey) => {
		if (sortConfig.key !== columnKey) return <FaSort />;
		return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
	};

	const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

	const handleMoveTo = async (taskId, newStatus) => {
		if (!newStatus) return;
		try {
			await updateTaskStatus(taskId, newStatus);
			setTasks(prev => prev.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
			showToast(`Task ${taskId} moved to ${newStatus}`);
		} catch (error) {
			console.error('Failed to update task status:', error);
		}
	};

	const handleDelete = async (taskId) => {
		if (!window.confirm('Are you sure you want to delete this task?')) return;
		try {
			await deleteTask(taskId);
			setTasks(prev => prev.filter(task => task.id !== taskId));
			showToast(`Task ${taskId} deleted`);
		} catch (error) {
			console.error('Failed to delete task:', error);
		}
	};

	const showToast = (msg) => {
		setToastMessage(msg);
		setTimeout(() => setToastMessage(''), 3000);
	};

	const filterAndSortTasks = (status) => {
		const filtered = tasks.filter((task) => task.status === status);
		const sorted = [...filtered].sort((a, b) => {
			if (!sortConfig.key) return 0;
			const aVal = a[sortConfig.key];
			const bVal = b[sortConfig.key];
			if (aVal == null) return 1;
			if (bVal == null) return -1;

			return typeof aVal === 'string'
				? (sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal))
				: (sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal);
		});

		return sorted;
	};

	const renderTable = (taskList) => {
		const indexOfLast = currentPage * tasksPerPage;
		const indexOfFirst = indexOfLast - tasksPerPage;
		const currentTasks = taskList.slice(indexOfFirst, indexOfLast);
		const totalPages = Math.ceil(taskList.length / tasksPerPage);

		return (
			<div className="table-responsive">
				{toastMessage && (
					<div className="alert alert-success alert-dismissible fade show" role="alert">
						{toastMessage}
						<button type="button" className="btn-close" onClick={() => setToastMessage('')} aria-label="Close"></button>
					</div>
				)}

				<table className="table table-hover align-middle table-bordered shadow-sm bg-white rounded">
					<thead className="table-light">
						<tr>
							{['id', 'title', 'description', 'dueDate'].map((col) => (
								<th
									key={col}
									onClick={() => handleSort(col)}
									tabIndex={0}
									style={{ cursor: 'pointer' }}
									aria-sort={
										sortConfig.key === col
											? sortConfig.direction === 'asc'
												? 'ascending'
												: 'descending'
											: 'none'
									}
								>
									<div className="d-flex justify-content-between align-items-center">
										<span className="text-capitalize">{col}</span>
										{getSortIcon(col)}
									</div>
								</th>
							))}
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{currentTasks.length === 0 ? (
							<tr>
								<td colSpan="5" className="text-center text-muted py-4">No tasks found.</td>
							</tr>
						) : (
							currentTasks.map((task) => (
							
								<tr
									key={task.id}
									onClick={() => handleRowClick(task.id)}
									tabIndex={0}
									style={{ cursor: 'pointer' }}
								>
									<td>{task.id}</td>
									<td>{task.title}</td>
									<td dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.description) }} />
									<td>{formatDate(task.dueDate)}</td>
									<td>
										<div className="d-flex gap-2">
											<select
												className="form-select"
												value={task.status}
												onClick={(e) => e.stopPropagation()}
												onChange={(e) => handleMoveTo(task.id, e.target.value)}
											>
												<option value="pending">Pending</option>
												<option value="committed">Committed</option>
												<option value="completed">Completed</option>
											</select>

											<button
												className="btn btn-sm btn-outline-danger"
												onClick={(e) => {
													e.stopPropagation();
													handleDelete(task.id);
												}}
											>
												<FaTrash />
											</button>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>

				{/* Pagination */}
				{taskList.length > tasksPerPage && (
					<div className="d-flex justify-content-center align-items-center my-3 gap-3">
						<button
							className="btn btn-sm btn-outline-primary"
							disabled={currentPage === 1}
							onClick={() => setCurrentPage(currentPage - 1)}
						>
							Previous
						</button>
						<span>
							Page {currentPage} of {totalPages}
						</span>
						<button
							className="btn btn-sm btn-outline-primary"
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage(currentPage + 1)}
						>
							Next
						</button>
					</div>
				)}
			</div>
		);
	};

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		setCurrentPage(1); // reset pagination on tab switch
	};

	return (
		<div className="task-table-wrapper mt-4">
			<ul className="nav nav-tabs mb-3">
				{['pending', 'committed', 'completed'].map((tab) => (
					<li className="nav-item" key={tab}>
						<button
							className={`nav-link ${activeTab === tab ? 'active' : ''}`}
							onClick={() => handleTabChange(tab)}
							role="tab"
						>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
						</button>
					</li>
				))}
			</ul>

			{renderTable(filterAndSortTasks(activeTab))}
		</div>
	);
}
