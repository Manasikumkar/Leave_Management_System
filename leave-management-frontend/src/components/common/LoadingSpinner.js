import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const spinnerSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : undefined;

  return (
    <div className="loading-spinner">
      <div className="text-center">
        <Spinner 
          animation="border" 
          role="status"
          size={spinnerSize}
          className="mb-3"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="text-muted">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;