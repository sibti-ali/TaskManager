import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../styling/HomeLayout.css';

export default function Layout() {
	const location = useLocation();
	const currentPath = location.pathname;

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(prev => !prev);
	};

	return (
		<>
			<div className="app-wrapper">
				<header className="main-header">
					<div className="container header-content">
						<Link to="/" className="logo">TaskManager</Link>

						<nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
							<Link className='btn btn-primary btn-sm createbtn' to="/create">Create Task</Link>
							<Link to="/">Home</Link>
							<Link to="/kanban">Kanban view</Link>
						</nav>

						<button className="burger" onClick={toggleMenu} aria-label="Toggle navigation menu">
							<span className="burger-bar"></span>
							<span className="burger-bar"></span>
							<span className="burger-bar"></span>
						</button>
					</div>
				</header>

				<main className="main-content container">
					<Outlet />
				</main>

				<footer className="main-footer container">
					<p>&copy; 2025 Task Manager. All rights reserved.</p>
				</footer>
			</div>
		</>
	);
}
