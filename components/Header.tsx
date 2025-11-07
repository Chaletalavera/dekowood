
import React from 'react';

const WoodIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11.2V21a1 1 0 0 0 1 1h4.5a1 1 0 0 0 1-1v-5.2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1V21a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1v-9.8a1 1 0 0 0-.4-1.2l-7-5.2a1 1 0 0 0-1.2 0l-7 5.2A1 1 0 0 0 4 11.2z" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3">
        <WoodIcon />
        <h1 className="text-3xl font-bold text-amber-900 tracking-tight">
          dekowood
        </h1>
        <span className="text-xl font-light text-stone-600">AI Visualizer</span>
      </div>
    </header>
  );
};
