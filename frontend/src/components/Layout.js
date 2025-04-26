import React, { useState } from 'react';
import { Link, Outlet} from 'react-router-dom';
import '../styling/HomeLayout.css';

export default function Layout() {

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(prev => !prev);
	};

	return (
		<>
			<div className="app-wrapper">
				<header className="main-header">
					<div className="container header-content">
					
						<div className="logo-burger">
							<Link to="/" className="logo">TaskManager</Link>

							<button className="burger" onClick={toggleMenu} aria-label="Toggle navigation menu">
							<span className="burger-bar"></span>
							<span className="burger-bar"></span>
							<span className="burger-bar"></span>
							</button>
						</div>

						<nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
						<Link className='btn btn-primary btn-sm createbtn' to="/create">Create Task</Link>
						<Link to="/">Home</Link>
						<Link to="/kanban">Kanban view</Link>
						</nav>
					</div>
				</header>

				<main className="main-content container">
					<Outlet />
				</main>

				<footer className="main-footer bg-dark text-white text-center py-3">
					<p>&copy; 2025 Task Manager. All rights reserved.</p>
				</footer>
			</div>
		</>
	);
}
