import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styling/ErrorPage.css'; // Importing the CSS file for styling

const ErrorPage = () => {
  const location = useLocation();
  const { errorDetails } = location.state || {}; // Grab the error details from location state

  return (
    <div className="error-container">
      <h1 className="error-heading">Something went wrong</h1>
      <p className="error-message">We couldn't process your request right now.</p>
      
      {errorDetails && (
        <>
          <p className="error-details">
            <strong>Error Message:</strong> {errorDetails.message}
          </p>
          <p className="error-details">
            <strong>Status Code:</strong> {errorDetails.status}
          </p>
          <p className="error-details">
            <strong>Additional Info:</strong> {JSON.stringify(errorDetails.data)}
          </p>
        </>
      )}

      <Link to="/" className="error-link">Go back Home</Link>
    </div>
  );
};

export default ErrorPage;
