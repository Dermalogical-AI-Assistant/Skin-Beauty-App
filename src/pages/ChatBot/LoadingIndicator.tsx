import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-white/70 absolute top-0 left-0"></div>
      </div>
      <p className="text-white/70 text-sm">Loading messages...</p>
    </div>
  );
};

export default LoadingIndicator;