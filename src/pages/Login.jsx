import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, Send, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const { login } = useData();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Imitatsiya (Ozroq kutish effekti)
    setTimeout(() => {
      const res = login(username, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-4 relative overflow-hidden">
      
      {/* Orqa fon bezaklari */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-[40px] shadow-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* LOGO QISMI */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30 mb-4 transform rotate-3 hover:rotate-0 transition-all duration-300">
            <ShieldCheck size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Tizimga Kirish</h1>
          <p className="text-blue-200 text-sm font-medium mt-1">CRM Boshqaruv Paneli</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Login Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-200 uppercase ml-2 tracking-wider">Login</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-white transition-colors" size={20} />
              <input 
                type="text" 
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-white/30 outline-none focus:border-blue-400 focus:bg-black/40 transition-all"
                placeholder="Login kiriting"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Parol Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-200 uppercase ml-2 tracking-wider">Parol</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-white transition-colors" size={20} />
              <input 
                type="password" 
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-white/30 outline-none focus:border-blue-400 focus:bg-black/40 transition-all"
                placeholder="Parolni kiriting"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Xatolik xabari */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-sm font-bold text-center animate-in slide-in-from-top-2">
              ⚠️ {error}
            </div>
          )}

          {/* KIRISH TUGMASI */}
          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <> Kirish <ArrowRight size={20} /> </>
            )}
          </button>
        </form>

        {/* --- TELEGRAM MUROJAAT QISMI (ENG PASTDA) --- */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center flex flex-col items-center">
          <p className="text-blue-200/60 text-xs font-bold mb-3 uppercase tracking-wide">
            Login va parolni olish uchun
          </p>
          
          <a 
            href="https://t.me/xaamiitov"  // <--- ✅ SIZNING NIKINGIZ
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-400/50 transition-all group w-full justify-center"
          >
            <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
               <Send size={16} fill="currentColor" />
            </div>
            <span className="text-white font-bold text-sm group-hover:text-blue-200 transition-colors">
              Telegramdan yozish
            </span>
          </a>
        </div>

      </div>
      
      {/* Footer text */}
      <div className="absolute bottom-6 text-white/20 text-xs font-bold text-center w-full">
        © 2024 CRM System | Developed by @xaamiitov
      </div>

    </div>
  );
};