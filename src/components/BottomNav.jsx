import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Wallet, 
  Settings 
} from 'lucide-react';

export const BottomNav = () => {
  const { theme } = useData();
  const isDark = theme === 'dark';

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={24} />, label: 'Asosiy' },
    { path: '/students', icon: <Users size={24} />, label: 'O\'quvchi' },
    { path: '/groups', icon: <Layers size={24} />, label: 'Guruh' },
    { path: '/finance', icon: <Wallet size={24} />, label: 'Moliya' },
    { path: '/settings', icon: <Settings size={24} />, label: 'Sozlama' },
  ];

  return (
    // 🔥 "md:hidden" -> Kompyuterda yo'q, Telefonda bor
    <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t z-50 pb-safe transition-colors duration-300 ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
      <div className="flex justify-around items-center px-2 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-full transition-all duration-300
              ${isActive 
                ? 'text-blue-600 scale-105' 
                : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}
            `}
          >
            {item.icon}
            <span className="text-[10px] font-bold mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};