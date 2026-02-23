import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Wallet, ArrowUpCircle, ArrowDownCircle, 
  TrendingUp, History, X, Plus, Minus 
} from 'lucide-react';

export const Finance = () => {
  const { payments, expenses, addPayment, addExpense, theme } = useData();
  const isDark = theme === 'dark';

  // State: Modallar uchun
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Forma ma'lumotlari
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // --- STATISTIKA HISOBLASH ---
  const totalIncome = payments.reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + (parseInt(e.amount) || 0), 0);
  const profit = totalIncome - totalExpense;

  // --- KIRIM QILISH ---
  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    if (!amount || !reason) return alert("Summa va Sababni kiriting!");

    addPayment({
      amount: amount,
      reason: reason,
      date: date,
      type: 'income',
      student: reason
    });

    setIsIncomeModalOpen(false);
    resetForm();
  };

  // --- CHIQIM QILISH ---
  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!amount || !reason) return alert("Summa va Sababni kiriting!");

    addExpense({
      amount: amount,
      category: reason,
      date: date,
      type: 'expense'
    });

    setIsExpenseModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setReason('');
    setDate(new Date().toISOString().slice(0, 10));
  };

  const allTransactions = [...(payments || []), ...(expenses || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className={`p-10 min-h-screen pb-24 transition-all duration-300 ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER & ACTION BUTTONS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Wallet className="text-cyan-500"/> Moliya
          </h1>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Kirim va chiqimlarni nazorat qilish markazi
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsIncomeModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition active:scale-95"
          >
            <Plus size={20} strokeWidth={3}/> Kirim
          </button>
          <button 
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition active:scale-95"
          >
            <Minus size={20} strokeWidth={3}/> Chiqim
          </button>
        </div>
      </div>

      {/* STATISTIKA KARTALARI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         {/* Kirim */}
         <div className={`p-6 rounded-[32px] border relative overflow-hidden ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-2 text-emerald-500 font-bold">
               <ArrowUpCircle size={24}/> Jami Kirim
            </div>
            <p className="text-3xl font-black text-emerald-500">
               +{totalIncome.toLocaleString()}
            </p>
         </div>

         {/* Chiqim */}
         <div className={`p-6 rounded-[32px] border relative overflow-hidden ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-2 text-rose-500 font-bold">
               <ArrowDownCircle size={24}/> Jami Chiqim
            </div>
            <p className="text-3xl font-black text-rose-500">
               -{totalExpense.toLocaleString()}
            </p>
         </div>

         {/* Sof Foyda */}
         <div className={`p-6 rounded-[32px] border relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-blue-900/20 to-[#161d31] border-blue-500/20' : 'bg-blue-50 border-blue-100 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-2 text-blue-500 font-bold">
               <TrendingUp size={24}/> Sof Foyda
            </div>
            <p className={`text-3xl font-black ${profit >= 0 ? 'text-blue-500' : 'text-rose-500'}`}>
               {profit.toLocaleString()}
            </p>
         </div>
      </div>

      {/* 🔥 TARIX JADVALI (SCROLLABLE & FIXED HEIGHT) */}
      <div className={`rounded-[32px] border shadow-sm flex flex-col h-[600px] ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
         
         {/* Header qismi qotirilgan (fixed) */}
         <div className={`p-6 border-b font-bold flex items-center gap-2 shrink-0 ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
            <History size={20}/> So'nggi Operatsiyalar ({allTransactions.length} ta)
         </div>
         
         {/* Jadval qismi aylanadigan (scrollable) */}
         <div className="overflow-y-auto flex-1 custom-scrollbar">
            {allTransactions.length > 0 ? (
               <table className="w-full text-left border-collapse">
                 <thead className={`sticky top-0 z-10 text-xs uppercase border-b ${isDark ? 'bg-[#161d31] border-white/5 text-slate-500' : 'bg-white border-slate-100 text-slate-400'}`}>
                   <tr>
                     <th className="p-6">Sana</th>
                     <th className="p-6">Sabab / Kategoriya</th>
                     <th className="p-6">Tur</th>
                     <th className="p-6 text-right">Summa</th>
                   </tr>
                 </thead>
                 <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                   {allTransactions.map((item, index) => (
                     <tr key={index} className={`transition ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                       <td className={`p-6 font-mono text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.date}</td>
                       
                       <td className="p-6 font-bold">
                          {item.student || item.category || item.reason || "Izohsiz"}
                       </td>
                       
                       <td className="p-6">
                         <span className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center w-fit gap-1 ${item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                           {item.type === 'income' ? <ArrowUpCircle size={14}/> : <ArrowDownCircle size={14}/>}
                           {item.type === 'income' ? 'Kirim' : 'Chiqim'}
                         </span>
                       </td>
                       
                       <td className={`p-6 text-right font-black text-lg ${item.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                         {item.type === 'income' ? '+' : '-'}{parseInt(item.amount).toLocaleString()}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            ) : (
               <div className={`h-full flex flex-col items-center justify-center p-20 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                 <Wallet size={48} className="mx-auto mb-4 opacity-50"/>
                 <p>Hozircha moliyaviy operatsiyalar yo'q</p>
               </div>
            )}
         </div>
      </div>

      {/* 🟢 KIRIM MODALI */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in">
           <div className={`w-full max-w-md p-8 rounded-[32px] border shadow-2xl scale-100 animate-in zoom-in-95 ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold text-emerald-500 flex items-center gap-2`}>
                   <ArrowUpCircle /> Kirim qilish
                </h2>
                <button onClick={() => setIsIncomeModalOpen(false)} className="text-slate-400 hover:text-rose-500"><X /></button>
              </div>
              
              <form onSubmit={handleIncomeSubmit} className="space-y-4">
                 <input type="number" placeholder="Summa (UZS)" className={`w-full p-4 rounded-2xl outline-none border font-bold text-lg ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={amount} onChange={e => setAmount(e.target.value)} required />
                 <input placeholder="Sabab (Masalan: Kurs uchun to'lov)" className={`w-full p-4 rounded-2xl outline-none border ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={reason} onChange={e => setReason(e.target.value)} required />
                 <input type="date" className={`w-full p-4 rounded-2xl outline-none border ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={date} onChange={e => setDate(e.target.value)} required />
                 
                 <button type="submit" className="w-full py-4 rounded-2xl font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition active:scale-95">Saqlash</button>
              </form>
           </div>
        </div>
      )}

      {/* 🔴 CHIQIM MODALI */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in">
           <div className={`w-full max-w-md p-8 rounded-[32px] border shadow-2xl scale-100 animate-in zoom-in-95 ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold text-rose-500 flex items-center gap-2`}>
                   <ArrowDownCircle /> Chiqim qilish
                </h2>
                <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-rose-500"><X /></button>
              </div>
              
              <form onSubmit={handleExpenseSubmit} className="space-y-4">
                 <input type="number" placeholder="Summa (UZS)" className={`w-full p-4 rounded-2xl outline-none border font-bold text-lg ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={amount} onChange={e => setAmount(e.target.value)} required />
                 <input placeholder="Sabab (Masalan: Ijara, Svet)" className={`w-full p-4 rounded-2xl outline-none border ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={reason} onChange={e => setReason(e.target.value)} required />
                 <input type="date" className={`w-full p-4 rounded-2xl outline-none border ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={date} onChange={e => setDate(e.target.value)} required />
                 
                 <button type="submit" className="w-full py-4 rounded-2xl font-bold bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition active:scale-95">Saqlash</button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};