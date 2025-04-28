import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// pages
import Home from './pages/Home';
import TaskForm from './components/TaskForm';
import Layout from './components/Layout';
import KanbanBoard from './components/KanbanBoard';
import ErrorPage from './pages/ErrorPage';
// error handling
import { ErrorProvider, useErrorContext } from './contexts/ErrorContext';
import { registerSetGlobalError } from './utils/errorHandler';
import { useEffect } from 'react';

function App() {
	return (
		<Router>
			<ErrorProvider>
				<MainApp />
			</ErrorProvider>
		</Router>
	);
}

function MainApp() {
	const { error, setError } = useErrorContext();
	const navigate = useNavigate();
	useEffect(() => {
		registerSetGlobalError(setError);
	}, [setError]);

	useEffect(() => {
		if (error) {
		  const safeError = {
			message: error?.statusText || 'Something went wrong',
			status: error?.status,
			data: error?.data,
		  };
		  navigate('/error', { state: { errorDetails: safeError } });
		}
	  }, [error, navigate]);

	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="/create" element={<TaskForm />} />
				<Route path="/edit/:taskId" element={<TaskForm />} />
				<Route path="/kanban" element={<KanbanBoard />} />
				<Route path="/error" element={<ErrorPage />} />
			</Route>
		</Routes>
	);
}

export default App;
