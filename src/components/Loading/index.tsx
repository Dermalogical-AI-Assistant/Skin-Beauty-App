import React from "react";

interface LoadingProps {
  entityName: string;
}

const Loading: React.FC<LoadingProps> = ({ entityName }) => {
  return (
    <div className="flex items-center justify-center p-6 text-gray-500">
      <svg
        className="mr-3 h-5 w-5 animate-spin text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <span>Loading {entityName}...</span>
    </div>
  );
};

export default Loading;
