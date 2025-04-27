import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useErrorContext } from '../contexts/ErrorContext';
import '../styling/ErrorPage.css';

const ErrorPage = () => {
  const location = useLocation();
  const { errorDetails } = location.state || {};
  const { setError } = useErrorContext();
  useEffect(() => {
    // Reset the error once the error page is loaded
    setError(null); // Reset the global error
  }, [setError]);
  return (
    <div className="error-container">
      <h1 className="error-heading">Something went wrong</h1>
      <p className="error-message">We couldn't process your request right now.</p>

      {errorDetails && (
        <div className="error-details-box">
          {errorDetails.message && (
            <p className="error-details">
              <strong>Error Message:</strong> {errorDetails.message}
            </p>
          )}
          {errorDetails.status && (
            <p className="error-details">
              <strong>Status Code:</strong> {errorDetails.status}
            </p>
          )}
          {errorDetails.data && (
            <p className="error-details">
              <strong>Additional Info:</strong> {typeof errorDetails.data === 'object'
                ? JSON.stringify(errorDetails.data)
                : errorDetails.data}
            </p>
          )}
        </div>
      )}

      <Link to="/" className="error-link">Go back Home</Link>
    </div>
  );
};

export default ErrorPage;
