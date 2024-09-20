import React from 'react';

const ErrorComponent = ({ error }) => (
  <div className="text-red-600 text-lg font-semibold">Error: {error.message}</div>
);

export default ErrorComponent;

