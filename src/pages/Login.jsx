import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, User, ArrowRight, Send, ShieldCheck, 
  Users, Layers, Zap, Check, X
} from 'lucide-react';

export const Login = () => {
  const { login } = useData();
  const navigate = useNavigate();
  
  // 🔥 LOGIN OYNASINI YASHIRISH/KO'RSATISH UCHUN STATE
  const [showLogin, setShowLogin] = useState(false);

  const [username, setUsername] = useState('ayewedu_AX');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
    <div className="min-h-screen bg-slate-900 overflow-y-auto font-sans relative flex flex-col">
      
      {/* Orqa fon yorug'lik effektlari */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]"></div>
      </div>

      {/* --- 1. NAVBAR (TEPADAGI QISMI) --- */}
      <nav className="w-full relative z-50 p-6 flex items-center justify-between max-w-7xl mx-auto">
         {/* Logo */}
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
               <ShieldCheck size={28} />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">AyewEdu CRM</span>
         </div>

         {/* Kirish Tugmasi (Agar login forma yopiq bo'lsa) */}
         {!showLogin && (
            <button 
              onClick={() => setShowLogin(true)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold backdrop-blur-md border border-white/10 transition-all active:scale-95 flex items-center gap-2 shadow-lg"
            >
               Tizimga Kirish <ArrowRight size={18}/>
            </button>
         )}
      </nav>

      {/* --- 2. HERO QISMI --- */}
      <div className="flex-1 relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-10 lg:py-0 gap-16 min-h-[calc(100vh-200px)]">
        
        {/* Chap tomon: Matnlar va Ma'lumot (Endi to'liq markazda turadi, agar login ochilmasa) */}
        <div className={`transition-all duration-700 w-full ${showLogin ? 'lg:w-1/2 text-left' : 'text-center flex flex-col items-center'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-sm mb-6 animate-in fade-in slide-in-from-bottom-5">
            <ShieldCheck size={16}/> Yangi avlod CRM tizimi
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-10 delay-100">
            Ta'lim Markazini <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Professional</span> Boshqaring
          </h1>
          <p className="text-lg text-slate-400 font-medium mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-10 delay-200">
            O'quvchilarni ro'yxatga olish, guruhlarni boshqarish, avtomatik davomat va moliyaviy hisobotlar bitta tizimda. Ishingizni 10 barobar osonlashtiring!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 delay-300">
            <div className="flex items-center gap-2 text-slate-300 font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <Check size={18} className="text-emerald-500"/> Cheksiz o'quvchilar
            </div>
            <div className="flex items-center gap-2 text-slate-300 font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <Check size={18} className="text-emerald-500"/> Avtomat davomat
            </div>
          </div>
        </div>

        {/* --- O'NG TOMON: LOGIN FORMASI (FAQAT TUGMA BOSILGANDA CHIQADI) --- */}
        {showLogin && (
          <div className="w-full max-w-md animate-in fade-in slide-in-from-right-10 zoom-in-95 duration-500 relative">
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-[40px] shadow-2xl relative">
              
              {/* Yopish tugmasi */}
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={20}/>
              </button>

              {/* LOGO QISMI */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30 mb-4 transform hover:scale-105 transition-all duration-300">
                  <ShieldCheck size={40} strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">Tizimga Kirish</h2>
                <p className="text-blue-200 text-sm font-medium mt-1">Boshqaruv paneliga xush kelibsiz</p>
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
              <h1 className="mt-[30px] text-[#fff] text-[14px]">Login va Prolni olish uchun adminstratorga murojat qiling👇</h1>
              {/* TELEGRAM MUROJAAT QISMI */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center flex flex-col items-center">
                <a 
                  href="https://t.me/xaamiitov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-400/50 transition-all group w-full justify-center"
                >
                  <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
                     <Send size={16} fill="currentColor" />
                  </div>
                  <span className="text-white font-bold text-sm group-hover:text-blue-200 transition-colors">
                    Login/Parolni adminstratordan olish
                  </span>
                </a>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* --- 3. DASTUR IMKONIYATLARI (FEATURES) --- */}
      <div className="relative z-10 bg-black/20 border-t border-white/5 py-24 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Tizim Imkoniyatlari</h2>
            <p className="text-slate-400 font-medium">Barcha jarayonlarni bitta oynada nazorat qiling</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
                <Users size={28}/>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">O'quvchilar Bazasi</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Har bir o'quvchining shaxsiy ma'lumotlari, telefon raqamlari va joriy holatini xavfsiz saqlang va tezkor toping.</p>
            </div>
            
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
                <Layers size={28}/>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Guruhlar Boshqaruvi</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Dars kunlari (Dushanba/Seshanba tiplari), vaqtlari va guruh narxlarini avtomatik hisoblovchi aqlli tizim.</p>
            </div>

            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
                <Zap size={28}/>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Tezkor Davomat</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Kunni o'zi aniqlab beruvchi va bir klik bilan saqlanadigan qulay yo'qlama qilish interfeysi.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-8 text-white/30 text-xs font-bold border-t border-white/5 bg-black/40">
        © 2026 CRM System | Developed by @xaamiitov
      </div>

    </div>
  );
};