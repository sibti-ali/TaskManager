// src/components/Layout.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom'; // This will render the child route components

export default function Layout() {
  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <header className="bg-dark text-white py-3 px-4">
        <h3 className="mb-0">Task Manager Dashboard</h3>
      </header>

      <div className="d-flex flex-grow-1">
        {/* Side Navigation */}
        <nav className="bg-light border-end p-3" style={{ width: '220px' }}>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/create" className="btn btn-success w-100">+ Create Task</Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/" className="nav-link">🏠 Home</Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/kanban" className="nav-link">🗂 Kanban Board</Link>
            </li>
            
          </ul>
        </nav>

        {/* Main Content (This is where child routes will render) */}
        <main className="flex-grow-1 p-4">
          <Outlet /> {/* Renders the child route content */}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-light text-center py-2 border-top">
        <small>© {new Date().getFullYear()} Task Manager. All rights reserved.</small>
      </footer>
    </div>
  );
}
