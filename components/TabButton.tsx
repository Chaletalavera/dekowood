
import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, icon }) => {
  const baseClasses = "flex items-center justify-center w-full sm:w-auto text-sm sm:text-base font-medium px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500";
  const activeClasses = "bg-amber-800 text-white shadow-md";
  const inactiveClasses = "bg-white text-stone-600 hover:bg-stone-100";

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};
