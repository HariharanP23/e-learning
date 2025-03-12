import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full text-konker-green">
      <div className="loading loading-ring loading-xs"></div>
      <div className="loading loading-ring loading-sm"></div>
      <div className="loading loading-ring loading-md"></div>
      <div className="loading loading-ring loading-sm"></div>
      <div className="loading loading-ring loading-xs"></div>
    </div>
  );
};

export default Loader;