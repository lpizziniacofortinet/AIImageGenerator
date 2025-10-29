
import React from 'react';
import { CameraIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <CameraIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-xl font-bold text-white tracking-wider">
          AI Profile Photo Generator
        </h1>
      </div>
    </header>
  );
};
