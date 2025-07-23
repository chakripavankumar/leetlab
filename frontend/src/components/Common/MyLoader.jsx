import React from 'react';
import { Code2 } from 'lucide-react';

const MyLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        {/* App Icon */}
        <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
          <Code2 className="w-8 h-8 text-primary animate-pulse" />
        </div>

        {/* Loading Text */}
        {/* <p className="text-base-content/60 mb-4">{text}</p> */}

        {/* DaisyUI Spinner */}
        <span className="loading  loading-dots loading-md text-primary"></span>
      </div>
    </div>
  );
};

export default MyLoader;
