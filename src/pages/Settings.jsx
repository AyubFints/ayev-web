import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Settings as SettingsIcon, Save, Shield, 
  Trash2, Moon, Sun, LogOut, CheckCircle2 
} from 'lucide-react';

export const Settings = () => {
  const { currentUser, theme, toggleTheme, logout } = useData();
  const isDark = theme === 'dark';

  // Parol o'zgartirish uchun state
  const [creds, setCreds] = useState({ username: 'ayewedu_AX', password: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // Real loyihada bu yerda API ga so'rov ketadi
    // Hozircha localStoragega saqlaymiz yoki shunchaki imitatsiya qilamiz
    if(creds.password) {
        localStorage.setItem('crm_custom_password', creds.password);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleResetData = () => {
      if(confirm("DIQQAT! Barcha o'quvchilar, guruhlar va to'lovlar o'chib ketadi. Rostdan ham rozimisiz?")) {
          localStorage.clear();
          window.location.reload();
      }
  }

  return (
    <div className="pb-20 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className={`text-3xl font-black flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <SettingsIcon size={32} className="text-slate-400"/>
          Sozlamalar
        </h1>
        <p className="text-slate-500 font-medium mt-1">Tizimni sozlash paneli</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. XAVFSIZLIK (Login/Parol) */}
        <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
           <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                 <Shield size={24}/>
              </div>
              <div>
                 <h3 className={`text-xl font-black ${isDark?'text-white':'text-slate-800'}`}>Xavfsizlik</h3>
                 <p className="text-xs text-slate-400 font-bold">Direktor ma'lumotlari</p>
              </div>
           </div>

           <form onSubmit={handleSave} className="space-y-4">
              <div>
                 <label className="text-xs font-bold text-slate-400 uppercase ml-2">Login</label>
                 <input 
                   disabled 
                   value={currentUser?.username || "Admin"} 
                   className={`w-full p-4 mt-1 rounded-2xl border font-bold opacity-50 cursor-not-allowed ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-100'}`}
                 />
              </div>
              <div>
                 <label className="text-xs font-bold text-slate-400 uppercase ml-2">Yangi Parol</label>
                 <input 
                   type="password"
                   placeholder="Yangi parol kiriting"
                   value={creds.password}
                   onChange={e => setCreds({...creds, password: e.target.value})}
                   className={`w-full p-4 mt-1 rounded-2xl border outline-none font-bold focus:border-blue-500 transition ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50'}`}
                 />
              </div>

              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 transition">
                 {saved ? <CheckCircle2 size={20}/> : <Save size={20}/>}
                 {saved ? "Saqlandi!" : "Saqlash"}
              </button>
           </form>
        </div>

        {/* 2. TIZIM KO'RINISHI VA XAVFLI HUDUD */}
        <div className="space-y-6">
           
           {/* Mavzu (Theme) */}
           <div className={`p-8 rounded-[32px] border flex items-center justify-between ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-yellow-500/10 text-yellow-500' : 'bg-slate-100 text-slate-600'}`}>
                    {isDark ? <Sun size={24}/> : <Moon size={24}/>}
                 </div>
                 <div>
                    <h3 className={`text-lg font-black ${isDark?'text-white':'text-slate-800'}`}>Tizim Mavzusi</h3>
                    <p className="text-xs text-slate-400 font-bold">{isDark ? "Tungi rejim" : "Kunduzgi rejim"}</p>
                 </div>
              </div>
              <button onClick={toggleTheme} className={`px-6 py-3 rounded-xl font-bold transition ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
                 O'zgartirish
              </button>
           </div>

           {/* Xavfli Hudud */}
           <div className={`p-8 rounded-[32px] border border-rose-200 bg-rose-50 dark:bg-rose-900/10 dark:border-rose-500/20`}>
              <h3 className="text-rose-600 font-black text-lg mb-2 flex items-center gap-2">
                 <Trash2 size={20}/> Xavfli Hudud
              </h3>
              <p className="text-rose-400 text-xs font-bold mb-6">
                 Diqqat! Bu tugma barcha ma'lumotlarni (O'quvchilar, Guruhlar, To'lovlar) butunlay o'chirib yuboradi. Qayta tiklash imkoni yo'q.
              </p>
              <button 
                onClick={handleResetData}
                className="w-full py-4 bg-white border-2 border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 rounded-2xl font-bold transition-all active:scale-95"
              >
                 Barcha ma'lumotlarni tozalash
              </button>
           </div>

           {/* Chiqish */}
           <button 
             onClick={logout}
             className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition ${isDark ? 'border-white/10 hover:bg-white/5 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}
           >
              <LogOut size={20}/> Tizimdan chiqish
           </button>

        </div>

      </div>
    </div>
  );
};