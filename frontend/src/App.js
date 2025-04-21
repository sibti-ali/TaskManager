import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TaskForm from './components/TaskForm';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<TaskForm />} />
          <Route path="/edit/:taskId" element={<TaskForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
