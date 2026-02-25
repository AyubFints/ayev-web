import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  LayoutDashboard, Users, Layers, Wallet, Settings, 
  LogOut, Moon, Sun, Menu, ClipboardCheck 
} from 'lucide-react'; // 🔥 ClipboardCheck qo'shildi

export const Sidebar = () => {
  const { logout, theme, toggleTheme } = useData();
  const isDark = theme === 'dark';

  const menuItems = [
    { path: '/dashboard', name: 'Boshqaruv', icon: LayoutDashboard },
    { path: '/students', name: "O'quvchilar", icon: Users },
    { path: '/groups', name: 'Guruhlar', icon: Layers },
    // 🔥 YAngi bo'lim shu yerga qo'shildi
    { path: '/attendance', name: 'Davomat', icon: ClipboardCheck },
    { path: '/payments', name: "To'lovlar", icon: Wallet },
    { path: '/settings', name: 'Sozlamalar', icon: Settings },
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR (KENGAYADIGAN) --- */}
      <aside 
        className={`
          hidden md:flex fixed left-0 top-0 h-screen z-50 flex-col justify-between border-r transition-all duration-300 ease-in-out
          w-20 hover:w-72 group overflow-hidden
          ${isDark ? 'bg-[#0b1120] border-white/10' : 'bg-white border-slate-200'}
        `}
      >
        
        {/* 1. LOGO QISMI */}
        <div className="h-20 flex items-center px-5 gap-4">
          {/* Logo Ikonkasi */}
          <div className="min-w-[40px] h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/30">
            A
          </div>
          {/* Logo Yozuvi (Faqat hover bo'lganda chiqadi) */}
          <h1 className={`text-xl font-black tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-800'}`}>
            AyewEdu
          </h1>
        </div>

        {/* 2. MENU TUGMALARI */}
        <nav className="flex-1 px-3 space-y-2 mt-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 overflow-hidden whitespace-nowrap
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : isDark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
              `}
            >
              {/* Ikonka (Doim turadi) */}
              <div className="min-w-[24px]">
                <item.icon size={24} strokeWidth={2} />
              </div>
              
              {/* Yozuv (Faqat hoverda chiqadi) */}
              <span className="font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* 3. PASTKI QISM (Theme + Logout) */}
        <div className="p-3 space-y-2 mb-4">
          
          {/* Theme Switcher */}
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all overflow-hidden whitespace-nowrap ${isDark ? 'hover:bg-white/5 text-yellow-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <div className="min-w-[24px]">
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </div>
            <span className="font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
              {isDark ? "Kunduzgi rejim" : "Tungi rejim"}
            </span>
          </button>

          {/* Logout */}
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 p-3 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all overflow-hidden whitespace-nowrap"
          >
            <div className="min-w-[24px]">
              <LogOut size={24} />
            </div>
            <span className="font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
              Tizimdan chiqish
            </span>
          </button>
        </div>

      </aside>


      {/* --- MOBILE MENU (TELEFONLAR UCHUN) --- */}
      {/* Telefonlarda pastda turadi, hover kerak emas */}
      <div className={`md:hidden fixed bottom-0 left-0 w-full p-4 border-t z-50 flex justify-around items-center ${isDark ? 'bg-[#0b1120] border-white/10' : 'bg-white border-slate-200'}`}>
         {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                p-3 rounded-2xl transition-all
                ${isActive ? 'bg-blue-600 text-white' : isDark ? 'text-slate-400' : 'text-slate-400'}
              `}
            >
              <item.icon size={24} />
            </NavLink>
         ))}
         <button onClick={toggleTheme} className="p-3 text-slate-400">
            {isDark ? <Sun size={24}/> : <Moon size={24}/>}
         </button>
         <button onClick={logout} className="p-3 text-rose-500">
            <LogOut size={24}/>
         </button>
      </div>
    </>
  );
};