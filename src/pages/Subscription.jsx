import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom'; // 🔥 Yo'naltirish uchun
import { Check, Calendar, ArrowRight, Layout, Zap, Shield } from 'lucide-react';

export const Subscription = () => {
  const { checkSubscription, PLANS, theme } = useData();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const subStatus = checkSubscription();
  
  // 🔥 STATE: Billing (month / year)
  const [billing, setBilling] = useState('month');

  // To'lov sahifasiga o'tish funksiyasi
  const goToCheckout = (planId, planName, price) => {
    navigate('/checkout', { 
      state: { 
        planId, 
        planName, 
        price, 
        billing 
      } 
    });
  };

  const plans = [
    {
      id: 'start',
      name: 'Start',
      priceMonth: 15,
      priceYear: 150, // 180 emas, 150 (Chegirma)
      icon: <Layout className="text-blue-500" size={32}/>,
      features: ['50 ta O\'quvchi', '5 ta Guruh', 'Moliyaviy hisobot', 'SMS xabarnoma'],
      color: 'blue'
    },
    {
      id: 'growth',
      name: 'Pro',
      priceMonth: 25,
      priceYear: 250,
      icon: <Zap className="text-yellow-500" size={32}/>,
      features: ['200 ta O\'quvchi', '15 ta Guruh', 'Barcha funksiyalar', 'Telegram Bot'],
      popular: true,
      color: 'yellow'
    },
    {
      id: 'scale',
      name: 'Business',
      priceMonth: 50,
      priceYear: 500,
      icon: <Shield className="text-emerald-500" size={32}/>,
      features: ['Cheksiz O\'quvchi', 'Cheksiz Guruh', 'VIP Server', 'Shaxsiy Menejer'],
      color: 'emerald'
    }
  ];

  return (
    <div className={`min-h-screen p-8 flex items-center justify-center ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-6xl w-full">
         
         <div className="text-center mb-10">
            <h1 className="text-4xl font-black mb-4">Tarif rejalarini tanlang</h1>
            <p className="text-slate-500 text-lg mb-8">
               {!subStatus.active ? <span className="text-rose-500 font-bold">Obuna vaqtingiz tugagan!</span> : "Biznesingiz uchun mos rejani tanlang."}
            </p>

            {/* 🔥 TOGGLE SWITCH */}
            <div className="flex justify-center">
               <div className={`p-1 rounded-full flex relative ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                  <button 
                    onClick={() => setBilling('month')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative z-10 ${billing === 'month' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'}`}
                  >
                     Oylik
                  </button>
                  <button 
                    onClick={() => setBilling('year')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative z-10 flex items-center gap-2 ${billing === 'year' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'}`}
                  >
                     Yillik <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md">-20%</span>
                  </button>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
               // Narxni hisoblash
               const finalPrice = billing === 'month' ? plan.priceMonth : plan.priceYear;
               
               return (
                 <div key={plan.id} className={`relative p-8 rounded-[32px] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'} ${plan.popular ? 'border-yellow-500 ring-4 ring-yellow-500/20' : ''}`}>
                    
                    {plan.popular && (
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-yellow-500 text-white font-bold text-xs rounded-full uppercase tracking-wider shadow-lg">
                          Eng Ommabop
                       </div>
                    )}

                    <div className="mb-6">
                       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-${plan.color}-500/10 text-${plan.color}-500`}>{plan.icon}</div>
                       <h3 className="text-2xl font-bold">{plan.name}</h3>
                       <div className="flex items-end gap-1 mt-2">
                          <span className="text-4xl font-black">${finalPrice}</span>
                          <span className="text-slate-500 font-medium">/{billing === 'month' ? 'oy' : 'yil'}</span>
                       </div>
                       {billing === 'year' && <p className="text-xs text-emerald-500 font-bold mt-1">2 oy tekin!</p>}
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                       {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3 font-medium text-sm">
                             <div className={`w-5 h-5 rounded-full flex items-center justify-center bg-${plan.color}-500/20 text-${plan.color}-500`}><Check size={12}/></div>
                             {feature}
                          </li>
                       ))}
                    </ul>

                    {/* 🔥 TUGMA ENDI CHECKOUTGA OLIB BORADI */}
                    <button 
                       onClick={() => goToCheckout(plan.id, plan.name, finalPrice)}
                       className={`w-full py-4 rounded-2xl font-bold text-lg transition shadow-lg active:scale-95 bg-${plan.color}-500 hover:bg-${plan.color}-600 text-white shadow-${plan.color}-500/30 flex items-center justify-center gap-2`}
                    >
                       Tanlash <ArrowRight size={20}/>
                    </button>
                 </div>
               );
            })}
         </div>
      </div>
    </div>
  );
};