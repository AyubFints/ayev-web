import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { CreditCard, Lock, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
const { planId, planName, price, billing } = location.state || {};
export const Checkout = () => {
  const { upgradePlan, theme } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  // Subscription sahifasidan kelgan ma'lumotlarni olamiz
  const { planId, planName, price, billing } = location.state || {};

  // Agar to'g'ridan-to'g'ri kirsa, qaytarib yuboramiz
  if (!planId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
         <button onClick={() => navigate('/subscription')} className="text-blue-500 font-bold">Orqaga qaytish</button>
      </div>
    );
  }

  // State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Karta raqamini chiroyli formatlash (0000 0000 0000 0000)
  const handleCardInput = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(val);
  };

  const handleExpiryInput = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if(val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2, 4);
    setExpiry(val);
  };

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // 🔥 O'ZGARTIRILDI: planId yoniga 'billing' ni ham qo'shdik
      // billing bu yerda 'month' yoki 'year' bo'ladi
      upgradePlan(planId, billing); 
      
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
         navigate('/');
         window.location.reload(); 
      }, 2000);
    }, 2000);
  };
  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50'}`}>
         <div className="text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/40">
               <CheckCircle size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-black mb-2">To'lov Muvaffaqiyatli! 🎉</h1>
            <p className="text-slate-500">Sizning <b>{planName}</b> tarifingiz faollashtirildi.</p>
         </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-[#0b1120] text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
      
      <div className={`max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-[32px] overflow-hidden shadow-2xl ${isDark ? 'bg-[#161d31]' : 'bg-white'}`}>
         
         {/* Chap tomon: Chek ma'lumotlari */}
         <div className={`p-10 flex flex-col justify-between ${isDark ? 'bg-[#1e2538]' : 'bg-slate-50'}`}>
            <div>
               <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-500 mb-8 transition">
                  <ArrowLeft size={18}/> Orqaga
               </button>
               <h2 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>To'lovni tasdiqlash</h2>
               <p className="text-slate-500 text-sm">Xavfsiz to'lov tizimi</p>
            </div>

            <div className="space-y-4 my-8">
               <div className="flex justify-between items-center pb-4 border-b border-dashed border-slate-500/20">
                  <span className="font-medium">Tanlangan Tarif</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{planName}</span>
               </div>
               <div className="flex justify-between items-center pb-4 border-b border-dashed border-slate-500/20">
                  <span className="font-medium">Davomiyligi</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{billing === 'month' ? '1 Oy' : '1 Yil'}</span>
               </div>
               <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Jami to'lov:</span>
                  <span className="text-3xl font-black text-blue-500">${price}</span>
               </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
               <ShieldCheck size={14} className="text-emerald-500"/>
               To'lovlar 256-bit shifrlash orqali himoyalangan.
            </div>
         </div>

         {/* O'ng tomon: Karta formasi */}
         <div className="p-10">
            <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Karta ma'lumotlari</h3>
            
            <form onSubmit={handlePay} className="space-y-6">
               
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Karta egasining ismi</label>
                  <input type="text" placeholder="SHAKHZODBEK" className={`w-full p-4 rounded-xl font-bold outline-none border focus:ring-2 ring-blue-500 transition ${isDark ? 'bg-[#0b1120] border-white/10' : 'bg-slate-50 border-slate-200'}`} required />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Karta raqami</label>
                  <div className="relative">
                     <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                     <input 
                        type="text" 
                        value={cardNumber}
                        onChange={handleCardInput}
                        placeholder="0000 0000 0000 0000" 
                        className={`w-full pl-12 pr-4 py-4 rounded-xl font-bold outline-none border focus:ring-2 ring-blue-500 transition ${isDark ? 'bg-[#0b1120] border-white/10' : 'bg-slate-50 border-slate-200'}`} 
                        required 
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Amal qilish muddati</label>
                     <input 
                        type="text" 
                        value={expiry}
                        onChange={handleExpiryInput}
                        placeholder="MM/YY" 
                        className={`w-full p-4 rounded-xl font-bold outline-none border focus:ring-2 ring-blue-500 transition ${isDark ? 'bg-[#0b1120] border-white/10' : 'bg-slate-50 border-slate-200'}`} 
                        required 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wider text-slate-500">CVC / CVV</label>
                     <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                        <input 
                           type="password" 
                           value={cvc}
                           onChange={(e) => setCvc(e.target.value.substring(0,3))}
                           placeholder="123" 
                           className={`w-full pl-12 pr-4 py-4 rounded-xl font-bold outline-none border focus:ring-2 ring-blue-500 transition ${isDark ? 'bg-[#0b1120] border-white/10' : 'bg-slate-50 border-slate-200'}`} 
                           required 
                        />
                     </div>
                  </div>
               </div>

               <button 
                  type="submit" 
                  disabled={loading || cardNumber.length < 19}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xl shadow-blue-500/30 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                  {loading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                     `To'lash $${price}`
                  )}
               </button>

            </form>
         </div>

      </div>
    </div>
  );
};