import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TaskForm from './components/TaskForm';
import Layout from './components/Layout';
import KanbanBoard from './components/KanbanBoard';
import ErrorPage from './pages/ErrorPage';

function App() {
	return (
		<Router>

			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/create" element={<TaskForm />} />
					<Route path="/edit/:taskId" element={<TaskForm />} />
					<Route path="/kanban" element={<KanbanBoard />} />
					<Route path="/error" element={<ErrorPage />} />
				</Route>
			</Routes>

		</Router>
	);
}

export default App;
