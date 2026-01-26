import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};