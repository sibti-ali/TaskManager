import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchTasks, updateTaskStatus } from "../api/taskApi";
import DOMPurify from "dompurify";
import "../styling/KanbanBoard.css";

const columns = ["pending", "committed", "completed"];

export default function KanbanBoard() {
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		const loadTasks = async () => {
			try {
				const response = await fetchTasks();
				if (Array.isArray(response)) setTasks(response);
				else console.error("Invalid task data");
			} catch (err) {
				console.error("Error fetching tasks:", err);
			}
		};
		loadTasks();
	}, []);

	const handleDragEnd = async (result) => {
		const { source, destination, draggableId } = result;

		if (!destination || source.droppableId === destination.droppableId)
			return;

		const taskId = parseInt(draggableId);
		const newStatus = destination.droppableId;

		setTasks((prev) =>
			prev.map((task) =>
				task.id === taskId ? { ...task, status: newStatus } : task
			)
		);

		try {
			await updateTaskStatus(taskId, newStatus);
		} catch (err) {
			console.error("Failed to update status:", err);
		}
	};

	return (
		<div className="kanban-container">
			<DragDropContext onDragEnd={handleDragEnd}>
				<div className="row">
					{columns.map((column) => (
						<div key={column} className="col">
							<h5 className="text-capitalize text-center mb-3">
								{column}
							</h5>
							<Droppable droppableId={column}>
								{(provided, snapshot) => (
									<div
										className={`kanban-column p-2 rounded ${snapshot.isDraggingOver
											? "bg-light"
											: "bg-white"
											}`}
										ref={provided.innerRef}
										{...provided.droppableProps}
										style={{ minHeight: "200px" }}
									>
										{tasks
											.filter(
												(task) => task.status === column
											)
											.map((task, index) => (
												<Draggable
													key={task.id}
													draggableId={String(
														task.id
													)}
													index={index}
												>
													{(provided, snapshot) => (
														<div
															ref={
																provided.innerRef
															}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className={`task-card mb-2 p-3 border rounded ${snapshot.isDragging
																? "bg-warning"
																: "bg-white"
																}`}
														>
															<strong>
																{task.title}
															</strong>
															<p
																className="card-text text-muted"
																dangerouslySetInnerHTML={{
																	__html: DOMPurify.sanitize(
																		task.description
																	),
																}}
															/>
															<small>
																Due:{" "}
																{new Date(
																	task.dueDate
																).toLocaleDateString()}
															</small>
														</div>
													)}
												</Draggable>
											))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>
					))}
				</div>
			</DragDropContext>
		</div>
	);
}
