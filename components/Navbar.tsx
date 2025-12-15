import React from 'react';
import { Home, PlusCircle, User } from 'lucide-react';
import { TabView } from '../types';

interface NavbarProps {
  currentTab: TabView;
  setTab: (tab: TabView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab }) => {
  const navItem = (tab: TabView, Icon: React.ElementType, label: string) => {
    const isActive = currentTab === tab;
    return (
      <button 
        onClick={() => setTab(tab)}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-pitch-500' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-xs font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-dark-900 border-t border-gray-800 flex justify-around items-center z-50 pb-safe">
      {navItem('HOME', Home, 'Home')}
      {navItem('CREATE', PlusCircle, 'New Match')}
      {navItem('PROFILE', User, 'Profile')}
    </div>
  );
};