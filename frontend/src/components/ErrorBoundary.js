import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null, info: null };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can log the error to an error reporting service here
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong!</h1>
          <p>{this.state.error ? this.state.error.message : 'Unknown error occurred'}</p>
          <Link to="/">Go back Home</Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
