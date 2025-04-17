// components/LoadingIndicator.tsx
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-dark"></div>
    </div>
  );
};

export default LoadingIndicator;
