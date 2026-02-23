import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  Users, Wallet, TrendingUp, Check, Star, 
  ArrowRight, Shield, Zap, Layout, Moon, Sun,
  MessageCircle, HelpCircle, ChevronDown, Globe, Smartphone
} from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useData();
  const isDark = theme === 'dark';

  // State: Narxlar (Oylik / Yillik)
  const [billing, setBilling] = useState('month');
  
  // State: FAQ (Savollar ochilishi uchun)
  const [openFaq, setOpenFaq] = useState(null);

  const goToLogin = () => navigate('/login', { state: { mode: 'login' } });
  const goToRegister = () => navigate('/login', { state: { mode: 'register' } });

  // --- DATA ---
  const plans = [
    {
      name: 'Start', 
      priceMonth: 15, 
      priceYear: 150, 
      icon: <Layout className="text-blue-500" size={32}/>,
      features: ['50 ta O\'quvchi', '5 ta Guruh', 'Moliyaviy hisobot', 'SMS xabarnoma'], 
      color: 'blue'
    },
    {
      name: 'Pro', 
      priceMonth: 25, 
      priceYear: 250, 
      icon: <Zap className="text-yellow-500" size={32}/>,
      features: ['200 ta O\'quvchi', '15 ta Guruh', 'Barcha funksiyalar', 'Telegram Bot'], 
      popular: true, 
      color: 'yellow'
    },
    {
      name: 'Business', 
      priceMonth: 50, 
      priceYear: 500, 
      icon: <Shield className="text-emerald-500" size={32}/>,
      features: ['Cheksiz O\'quvchi', 'Cheksiz Guruh', 'VIP Server', 'Shaxsiy Menejer'], 
      color: 'emerald'
    }
  ];

  const faqs = [
    { q: "Dasturni o'rnatish kerakmi?", a: "Yo'q, EduCore bulutli tizim. Internet bor har qanday joydan (telefon yoki kompyuter) kirishingiz mumkin." },
    { q: "Ma'lumotlarim o'chib ketmaydimi?", a: "Xavotir olmang. Biz har kuni avtomatik nusxa (backup) olamiz. Ma'lumotlaringiz 100% himoyalangan." },
    { q: "To'lov turlari qanaqa?", a: "Siz UzCard, Humo, Visa kartalari orqali to'lov qilishingiz mumkin. Korporativ mijozlar uchun hisob raqamga o'tkazish ham bor." },
    { q: "Yillik to'lov qilsam chegirma bormi?", a: "Ha! Yillik to'lovni tanlasangiz 2 oy bepul bo'ladi (20% tejaysiz)." }
  ];

  const testimonials = [
    { name: "Jamshid Aka", role: "Cambridge LC asoschisi", text: "EduCore bilan ish boshlaganimizdan beri daromadimiz 30% ga oshdi. Endi qaysi o'quvchi qarzdor ekanini aniq bilaman." },
    { name: "Malika Opa", role: "Smart Kids direktori", text: "O'qituvchilarning oyligini hisoblash oldin 2 kun vaqtimni olardi. Hozir esa bitta tugma bilan hal bo'lyapti." },
    { name: "Azizbek", role: "Start Up o'quv markazi", text: "Telefondan turib butun markazni boshqara olishim — men uchun eng katta qulaylik. Tavsiya qilaman!" }
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? 'bg-[#0b1120] text-slate-300' : 'bg-white text-slate-900'}`}>
      
      {/* --- 1. NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${isDark ? 'bg-[#0b1120]/80 border-white/5' : 'bg-white/80 border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">Ec</div>
              <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>EduCore</span>
           </div>
           <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className={`p-2 rounded-full transition ${isDark ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                 {isDark ? <Sun size={20}/> : <Moon size={20}/>}
              </button>
              <button onClick={goToLogin} className={`hidden md:block px-6 py-2.5 font-bold transition ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-blue-600'}`}>Kirish</button>
              <button onClick={goToRegister} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">Boshlash</button>
           </div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <div className="pt-40 pb-20 px-6 relative overflow-hidden">
         <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 ${isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
               <Star size={16} fill="currentColor"/> 
               <span>O'quv markazlar uchun №1 CRM tizimi</span>
            </div>
            
            <h1 className={`text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
               Biznesingizni <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Avtopilotga</span> o'tkazing.
            </h1>
            
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
               O'quvchilarni ro'yxatga olishdan tortib, moliya va SMS xabarnomalargacha — hammasi bitta qulay platformada.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
               <button onClick={goToRegister} className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2">
                  Bepul Sinab Ko'rish <ArrowRight size={20}/>
               </button>
               <button onClick={() => window.location.href='#pricing'} className={`w-full md:w-auto px-8 py-4 border rounded-2xl font-bold text-lg transition ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                  Narxlarni Ko'rish
               </button>
            </div>
         </div>
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[100px] -z-10 animate-pulse ${isDark ? 'bg-blue-500/10' : 'bg-gradient-to-tr from-blue-100 to-purple-100 opacity-60'}`}></div>
      </div>

      {/* --- 3. STATISTIKA (TRUST) --- */}
      <div className={`py-10 border-y ${isDark ? 'bg-[#161d31]/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
               { num: "500+", label: "O'quv Markazlar" },
               { num: "50k+", label: "Aktiv O'quvchilar" },
               { num: "99.9%", label: "Ishlash Vaqti (Uptime)" },
               { num: "24/7", label: "Texnik Yordam" },
            ].map((stat, i) => (
               <div key={i}>
                  <h3 className={`text-3xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.num}</h3>
                  <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">{stat.label}</p>
               </div>
            ))}
         </div>
      </div>

      {/* --- 4. FEATURES (IMKONIYATLAR) --- */}
      <div className={`py-20 ${isDark ? 'bg-[#0b1120]' : 'bg-white'}`}>
         <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-16">
               <h2 className={`text-3xl md:text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Barcha kerakli vositalar</h2>
               <p className="text-slate-500 text-lg">Eski usuldagi daftarlarni unuting. Kelajak texnologiyalariga o'ting.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                   { icon: <Users size={32}/>, title: "O'quvchilar Bazasi", text: "Barcha o'quvchilar tarixi, to'lovlari va davomati bir joyda.", color: 'blue' },
                   { icon: <Wallet size={32}/>, title: "Aniq Moliya", text: "Kirim-chiqimlar, o'qituvchi oyliklari va sof foyda hisoboti.", color: 'emerald' },
                   { icon: <Globe size={32}/>, title: "Online Nazorat", text: "Dunyoni istalgan nuqtasidan turib biznesingizni kuzating.", color: 'purple' },
                   { icon: <Smartphone size={32}/>, title: "Mobil Versiya", text: "Telefoningiz uchun maxsus moslashtirilgan interfeys.", color: 'pink' },
                   { icon: <TrendingUp size={32}/>, title: "Lidlar (CRM)", text: "Yangi mijozlarni yo'qotmang va ularni nazorat qiling.", color: 'orange' },
                   { icon: <Shield size={32}/>, title: "Xavfsizlik", text: "Ma'lumotlaringiz shifrlangan holda xavfsiz serverlarda saqlanadi.", color: 'cyan' },
                ].map((item, idx) => (
                   <div key={idx} className={`p-8 rounded-[32px] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 ${isDark ? 'bg-[#161d31] border-white/5 hover:bg-[#1e2538]' : 'bg-white border-slate-100'}`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-${item.color}-500/10 text-${item.color}-500`}>
                         {item.icon}
                      </div>
                      <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                      <p className="text-slate-500">{item.text}</p>
                   </div>
                ))}
             </div>
         </div>
      </div>

      {/* --- 5. TESTIMONIALS (SHARHLAR) --- */}
      <div className={`py-20 border-t ${isDark ? 'bg-[#0f172a] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
         <div className="max-w-7xl mx-auto px-6">
            <h2 className={`text-3xl font-black text-center mb-12 ${isDark ? 'text-white' : 'text-slate-900'}`}>Mijozlarimiz nima deydi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {testimonials.map((t, i) => (
                  <div key={i} className={`p-8 rounded-[32px] relative ${isDark ? 'bg-[#1e2538]' : 'bg-white shadow-lg shadow-slate-200/50'}`}>
                     <div className="absolute top-8 right-8 text-yellow-500 flex gap-1">
                        {[1,2,3,4,5].map(s=><Star key={s} size={16} fill="currentColor"/>)}
                     </div>
                     <p className={`mb-6 text-lg italic ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>"{t.text}"</p>
                     <div>
                        <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.name}</h4>
                        <p className="text-sm text-slate-500">{t.role}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* --- 6. PRICING (OBUNALAR) --- */}
      <div id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-10">
            <h2 className={`text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Moslashuvchan Tariflar</h2>
            <p className="text-slate-500 text-lg mb-8">3 kunlik bepul sinov davri bilan boshlang.</p>

            {/* SWITCH */}
            <div className="flex items-center justify-center">
               <div className={`p-1 rounded-full flex relative ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                  <button onClick={() => setBilling('month')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative z-10 ${billing === 'month' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'}`}>Oylik</button>
                  <button onClick={() => setBilling('year')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative z-10 flex items-center gap-2 ${billing === 'year' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'}`}>
                     Yillik <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md">-20%</span>
                  </button>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
               <div key={idx} className={`relative p-8 rounded-[32px] border transition-all duration-300 hover:-translate-y-4 hover:shadow-2xl flex flex-col group ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'} ${plan.popular ? 'border-yellow-500 ring-4 ring-yellow-500/10 z-10 scale-105 shadow-xl' : ''}`}>
                  {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-yellow-500 text-white font-bold text-xs rounded-full uppercase tracking-wider">Eng Ommabop</div>}
                  <div className="mb-8">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-${plan.color}-500/10 text-${plan.color}-500`}>{plan.icon}</div>
                     <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                     <div className="flex items-end gap-1 mt-2">
                        <span className={`text-5xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{billing === 'month' ? plan.priceMonth : plan.priceYear}</span>
                        <span className="text-slate-500 font-bold mb-1">/{billing === 'month' ? '$ oyiga' : '$ yiliga'}</span>
                     </div>
                     {billing === 'year' && <p className="text-xs text-emerald-500 font-bold mt-1">Siz ${plan.priceMonth * 2} tejaysiz!</p>}
                  </div>
                  <ul className="flex-1 space-y-4 mb-8">
                     {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className={`flex items-center gap-3 font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                           <div className={`w-5 h-5 rounded-full flex items-center justify-center bg-${plan.color}-500/20 text-${plan.color}-500`}><Check size={12} strokeWidth={3}/></div>
                           {feature}
                        </li>
                     ))}
                  </ul>
                  <button onClick={goToRegister} className={`w-full py-4 rounded-2xl font-bold text-lg transition shadow-lg active:scale-95 bg-${plan.color}-500 hover:bg-${plan.color}-600 text-white shadow-${plan.color}-500/30`}>Tanlash</button>
               </div>
            ))}
         </div>
      </div>

      {/* --- 7. FAQ (SAVOL-JAVOB) --- */}
      <div className={`py-20 border-t ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
         <div className="max-w-3xl mx-auto px-6">
            <h2 className={`text-3xl font-black text-center mb-12 ${isDark ? 'text-white' : 'text-slate-900'}`}>Ko'p So'raladigan Savollar</h2>
            <div className="space-y-4">
               {faqs.map((f, i) => (
                  <div key={i} className={`rounded-2xl border overflow-hidden transition-all ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
                     <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-6 text-left font-bold text-lg outline-none"
                     >
                        <span className={isDark?'text-white':'text-slate-900'}>{f.q}</span>
                        <ChevronDown className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''} ${isDark?'text-slate-400':'text-slate-500'}`}/>
                     </button>
                     <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-slate-500">{f.a}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* --- 8. CTA & FOOTER --- */}
      <div className="py-20 px-6 text-center">
         <div className={`max-w-5xl mx-auto rounded-[48px] p-12 relative overflow-hidden ${isDark ? 'bg-blue-600' : 'bg-blue-600'}`}>
            <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Biznesingizni o'stirishga tayyormisiz?</h2>
               <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">Hozir ro'yxatdan o'ting va 5 kun davomida tizimdan mutlaqo bepul foydalaning.</p>
               <button onClick={goToRegister} className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-lg hover:bg-blue-50 transition shadow-xl">Hozir Boshlash</button>
            </div>
            {/* Dekorativ doiralar */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
         </div>
      </div>

      <footer className={`py-10 border-t text-center text-slate-500 transition-colors duration-300 ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
         <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">Ec</div>
            <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>EduCore</span>
         </div>
         <p className="mb-4">© 2026 EduCore Inc. O'zbekistonda ❤️ bilan.</p>
         <div className="flex justify-center gap-6 text-sm font-bold">
            <a href="#" className="hover:text-blue-500">Xizmatlar</a>
            <a href="#" className="hover:text-blue-500">Maxfiylik</a>
            <a href="#" className="hover:text-blue-500">Aloqa</a>
         </div>
      </footer>
    </div>
  );
};