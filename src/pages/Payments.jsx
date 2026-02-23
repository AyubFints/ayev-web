import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  TrendingUp, TrendingDown, Wallet, Plus, Trash2, 
  ArrowUpRight, ArrowDownRight, Calendar, User, Tag, DollarSign, X
} from 'lucide-react';

export const Payments = () => {
  const { db, addExpense, deleteExpense, theme } = useData();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('income'); // 'income' | 'expense'
  const [modal, setModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ reason: '', amount: '' });

  // Ma'lumotlar
  const payments = db?.payments || [];
  const expenses = db?.expenses || [];

  // Hisob-kitob
  const totalIncome = payments.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
  const totalExpense = expenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
  const netProfit = totalIncome - totalExpense;

  // Chiqim qo'shish
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (expenseForm.reason && expenseForm.amount) {
      addExpense(expenseForm);
      setExpenseForm({ reason: '', amount: '' });
      setModal(false);
    }
  };

  return (
    <div className="pb-20 animate-in fade-in duration-500">
      
      {/* --- HEADER: Kichik Statistika Kartalari (IXCHAM & TO'Q KO'K) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
         
         {/* 1. Jami Kirim (Teal Blue Gradient) */}
         <div className="bg-gradient-to-br from-blue-700 to-teal-800 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg shadow-blue-900/20 group hover:-translate-y-1 transition-all">
            <TrendingUp className="absolute top-4 right-4 opacity-30" size={60}/>
            <div className="relative z-10">
               <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1 flex items-center gap-2">
                 <ArrowUpRight size={14}/> Kirim
               </p>
               <h2 className="text-3xl font-black tracking-tight">+{totalIncome.toLocaleString()}</h2>
            </div>
         </div>

         {/* 2. Jami Chiqim (Indigo Blue Gradient) */}
         <div className="bg-gradient-to-br from-indigo-800 to-blue-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg shadow-indigo-900/20 group hover:-translate-y-1 transition-all">
            <TrendingDown className="absolute top-4 right-4 opacity-30" size={60}/>
            <div className="relative z-10">
               <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1 flex items-center gap-2">
                 <ArrowDownRight size={14}/> Chiqim
               </p>
               <h2 className="text-3xl font-black tracking-tight">-{totalExpense.toLocaleString()}</h2>
            </div>
         </div>

         {/* 3. Sof Foyda (Dark Slate Gradient) */}
         <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg shadow-slate-900/30 group hover:-translate-y-1 transition-all">
            <Wallet className="absolute top-4 right-4 opacity-30" size={60}/>
            <div className="relative z-10">
               <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1 flex items-center gap-2">
                 <Wallet size={14}/> Sof Foyda
               </p>
               <h2 className="text-3xl font-black tracking-tight">{netProfit.toLocaleString()}</h2>
            </div>
         </div>
      </div>

      {/* --- TABS (Ixcham va Ko'k) --- */}
      <div className={`flex p-1.5 rounded-2xl mb-6 w-full md:w-fit mx-auto md:mx-0 ${isDark ? 'bg-[#161d31] border border-white/10' : 'bg-white border border-slate-200 shadow-sm'}`}>
         <button 
           onClick={() => setActiveTab('income')}
           className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${activeTab === 'income' ? 'bg-teal-700 text-white shadow-md' : 'text-slate-400 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-white/5'}`}
         >
           <ArrowUpRight size={18}/> Kirimlar
         </button>
         <button 
           onClick={() => setActiveTab('expense')}
           className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${activeTab === 'expense' ? 'bg-indigo-800 text-white shadow-md' : 'text-slate-400 hover:text-indigo-800 hover:bg-indigo-50 dark:hover:bg-white/5'}`}
         >
           <ArrowDownRight size={18}/> Chiqimlar
         </button>
      </div>

      {/* --- KIRIMLAR RO'YXATI (Ixcham) --- */}
      {activeTab === 'income' && (
        <div className={`rounded-3xl border overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h3 className={`text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span className="w-2 h-6 bg-teal-600 rounded-full"></span>
              Kirimlar Tarixi
            </h3>
            <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2 py-1 rounded-lg">
              {payments.length} ta
            </span>
          </div>
          {payments.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {payments.slice().reverse().map((p) => (
                <div key={p.id} className={`p-4 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group border-l-4 border-transparent hover:border-teal-600`}>
                   <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                        <User size={20}/>
                      </div>
                      <div>
                        <h4 className={`font-bold ${isDark?'text-white':'text-slate-800'}`}>{p.studentName}</h4>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                           <Calendar size={12}/> {p.date}
                        </div>
                      </div>
                   </div>
                   <div className="font-black text-lg text-teal-700 mt-3 md:mt-0 bg-teal-50 dark:bg-teal-500/10 px-3 py-1.5 rounded-lg">
                     +{Number(p.amount).toLocaleString()}
                   </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="p-10 text-center text-slate-400 flex flex-col items-center">
                <Wallet size={40} className="mb-2 opacity-30"/>
                <p className="font-bold">Hali to'lovlar yo'q</p>
             </div>
          )}
        </div>
      )}

      {/* --- CHIQIMLAR RO'YXATI (Ixcham) --- */}
      {activeTab === 'expense' && (
        <div className="relative animate-in slide-in-from-bottom-4">
          
          <div className="flex justify-between items-center mb-4">
             <h3 className={`text-xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                Chiqimlar
             </h3>
             <button 
               onClick={() => setModal(true)}
               className="bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-800/20 active:scale-95 transition text-sm"
             >
               <Plus size={18}/> <span className="hidden md:inline">Qo'shish</span>
             </button>
          </div>

          <div className={`rounded-3xl border overflow-hidden shadow-sm ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
            {expenses.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {expenses.slice().reverse().map((e) => (
                    <div key={e.id} className={`p-4 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group border-l-4 border-transparent hover:border-indigo-600`}>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                            <Tag size={20}/>
                          </div>
                          <div>
                            <h4 className={`font-bold ${isDark?'text-white':'text-slate-800'}`}>{e.reason}</h4>
                            <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                              <Calendar size={12}/> {e.date}
                            </div>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3 md:mt-0">
                          <div className="font-black text-lg text-indigo-700 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg">
                            -{Number(e.amount).toLocaleString()}
                          </div>
                          <button onClick={() => deleteExpense(e.id)} className="p-2 bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-800 rounded-lg transition">
                              <Trash2 size={18}/>
                          </button>
                      </div>
                    </div>
                ))}
              </div>
            ) : (
               <div className="p-10 text-center text-slate-400 flex flex-col items-center">
                  <TrendingDown size={40} className="mb-2 opacity-30"/>
                  <p className="font-bold">Chiqimlar yo'q</p>
               </div>
            )}
          </div>
        </div>
      )}

      {/* --- CHIQIM QO'SHISH MODAL (Ixcham & To'q Ko'k) --- */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className={`w-full max-w-sm p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 ${isDark ? 'bg-[#161d31] border border-white/10' : 'bg-white'}`}>
             
             <div className="text-center mb-6">
                <div className="w-16 h-16 bg-indigo-800 rounded-full flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-800/30">
                  <DollarSign size={32}/>
                </div>
                <h3 className={`font-black text-2xl ${isDark?'text-white':'text-slate-900'}`}>Chiqim</h3>
             </div>
             
             <form onSubmit={handleAddExpense} className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-3 mb-1 block">Sababi</label>
                  <input 
                    className={`w-full p-4 rounded-2xl border outline-none font-bold text-base transition focus:border-indigo-800 ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} 
                    placeholder="Masalan: Ijara..."
                    value={expenseForm.reason} 
                    onChange={e=>setExpenseForm({...expenseForm, reason:e.target.value})} 
                    required
                  />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-3 mb-1 block">Summa</label>
                  <input 
                    type="number"
                    className={`w-full p-4 rounded-2xl border outline-none font-black text-2xl text-center text-indigo-800 transition focus:border-indigo-800 ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`} 
                    placeholder="0"
                    value={expenseForm.amount} 
                    onChange={e=>setExpenseForm({...expenseForm, amount:e.target.value})} 
                    required
                  />
               </div>
               <button className="w-full py-4 bg-indigo-800 hover:bg-indigo-900 text-white rounded-2xl font-bold shadow-lg shadow-indigo-800/30 text-lg transition active:scale-95">
                 Tasdiqlash
               </button>
             </form>
             <button onClick={() => setModal(false)} className="w-full mt-3 text-slate-400 font-bold hover:text-slate-600 text-base transition">Bekor qilish</button>
          </div>
        </div>
      )}

    </div>
  );
};