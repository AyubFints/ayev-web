import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  TrendingUp, TrendingDown, Wallet, 
  BarChart3, Users, Layers, AlertCircle, 
  Phone, ArrowUpRight, ArrowDownRight, Calendar 
} from 'lucide-react';

export const Dashboard = () => {
  const { db, theme } = useData();
  const isDark = theme === 'dark';

  // 1. MA'LUMOTLARNI OLISH
  const students = db?.students || [];
  const groups = db?.groups || [];
  const payments = db?.payments || [];
  const expenses = db?.expenses || [];

  // --- 2. OY VA YILNI TANLASH ---
  const today = new Date();
  // Default holatda hozirgi oy va yil turadi
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  // Oylar ro'yxati (O'zbekcha)
  const months = [
    { value: 1, label: "Yanvar" },
    { value: 2, label: "Fevral" },
    { value: 3, label: "Mart" },
    { value: 4, label: "Aprel" },
    { value: 5, label: "May" },
    { value: 6, label: "Iyun" },
    { value: 7, label: "Iyul" },
    { value: 8, label: "Avgust" },
    { value: 9, label: "Sentabr" },
    { value: 10, label: "Oktabr" },
    { value: 11, label: "Noyabr" },
    { value: 12, label: "Dekabr" },
  ];

  // --- 3. FILTRLASH LOGIKASI ---
  
  // Tanlangan oy va yilga mos keladigan ma'lumotlarni saralab olamiz
  const filterByDate = (items) => {
    return items.filter(item => {
       // Bazada sana "DD.MM.YYYY" formatida saqlangan (masalan: 15.02.2024)
       if (!item.date) return false;
       const parts = item.date.split('.'); // ['15', '02', '2024']
       const itemMonth = parseInt(parts[1]); // 2
       const itemYear = parseInt(parts[2]);  // 2024

       return itemMonth === parseInt(selectedMonth) && itemYear === parseInt(selectedYear);
    });
  };

  const monthlyPayments = filterByDate(payments);
  const monthlyExpenses = filterByDate(expenses);

  // --- 4. HISOB-KITOB (Faqat tanlangan oy uchun) ---
  
  // Jami Kirim (Tanlangan oy)
  const totalIncome = monthlyPayments.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
  
  // Jami Chiqim (Tanlangan oy)
  const totalExpense = monthlyExpenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
  
  // Sof Foyda (Tanlangan oy)
  const netProfit = totalIncome - totalExpense;

  // QARZDORLAR (Bu oydagi to'lov qilmaganlar)
  const debtors = useMemo(() => {
    return students.filter(student => {
      // Shu oyda to'lov qilganmi?
      const hasPaid = payments.some(p => {
        const parts = p.date.split('.');
        return p.studentId === student.id && 
               Number(parts[1]) === parseInt(selectedMonth) && 
               Number(parts[2]) === parseInt(selectedYear);
      });
      return !hasPaid;
    });
  }, [students, payments, selectedMonth, selectedYear]);

  // GRAFIK UCHUN DATA (Yillik dinamika)
  const chartData = useMemo(() => {
      const data = months.map(m => ({ label: m.label.slice(0, 3), income: 0 }));
      payments.forEach(p => {
        const [d, m, y] = p.date.split('.');
        if (Number(y) === parseInt(selectedYear)) {
            data[Number(m) - 1].income += Number(p.amount);
        }
      });
      const maxVal = Math.max(...data.map(d => d.income)) || 1;
      return { data, maxVal };
  }, [payments, selectedYear]);


  return (
    <div className="pb-20 animate-in fade-in duration-500">
      
      {/* HEADER VA FILTR */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Boshqaruv Paneli</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
             <Calendar size={16}/> {months[selectedMonth-1].label}, {selectedYear} holatiga ko'ra
          </p>
        </div>
        
        {/* OY VA YIL TANLASH MENYUSI */}
        <div className="flex gap-3">
            {/* Oylar */}
            <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`px-4 py-3 rounded-xl font-bold border outline-none cursor-pointer transition focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-[#161d31] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
            >
                {months.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))}
            </select>

            {/* Yillar (2024 dan 2030 gacha) */}
            <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={`px-4 py-3 rounded-xl font-bold border outline-none cursor-pointer transition focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-[#161d31] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
            >
                {[2024, 2025, 2026, 2027, 2028].map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
        </div>
      </div>

      {/* --- MOLIYA KARTALARI (DYNAMIC) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        {/* 1. Oylik Kirim */}
        <div className="bg-gradient-to-br from-blue-700 to-teal-800 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg shadow-blue-900/20 group hover:-translate-y-1 transition-all">
          <TrendingUp className="absolute top-4 right-4 opacity-30" size={60}/>
          <div className="relative z-10">
              <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1 flex items-center gap-2">
                <ArrowUpRight size={14}/> {months[selectedMonth-1].label} oyidagi Kirim
              </p>
              <h2 className="text-3xl font-black tracking-tight">
                 {totalIncome === 0 ? "0" : `+${totalIncome.toLocaleString()}`}
              </h2>
          </div>
        </div>

        {/* 2. Oylik Chiqim */}
        <div className="bg-gradient-to-br from-indigo-800 to-blue-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg shadow-indigo-900/20 group hover:-translate-y-1 transition-all">
          <TrendingDown className="absolute top-4 right-4 opacity-30" size={60}/>
          <div className="relative z-10">
              <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1 flex items-center gap-2">
                <ArrowDownRight size={14}/> {months[selectedMonth-1].label} oyidagi Chiqim
              </p>
              <h2 className="text-3xl font-black tracking-tight">
                 {totalExpense === 0 ? "0" : `-${totalExpense.toLocaleString()}`}
              </h2>
          </div>
        </div>

        {/* 3. Oylik Sof Foyda */}
        <div className={`p-6 rounded-2xl relative overflow-hidden shadow-lg group hover:-translate-y-1 transition-all text-white
             ${netProfit >= 0 ? 'bg-gradient-to-br from-emerald-600 to-green-700 shadow-emerald-900/20' : 'bg-gradient-to-br from-rose-600 to-red-700 shadow-rose-900/20'}`}>
          <Wallet className="absolute top-4 right-4 opacity-30" size={60}/>
          <div className="relative z-10">
              <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1 flex items-center gap-2">
                <Wallet size={14}/> {months[selectedMonth-1].label} oyidagi Foyda
              </p>
              <h2 className="text-3xl font-black tracking-tight">{netProfit.toLocaleString()}</h2>
          </div>
        </div>

      </div>

      {/* --- YILLIK GRAFIK --- */}
      <div className={`p-6 rounded-3xl border mb-8 transition-all ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 text-blue-800 rounded-lg"><BarChart3 size={20}/></div>
          <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedYear}-yil Dinamikasi</h3>
        </div>

        <div className="h-56 flex items-end justify-between gap-2 md:gap-4">
          {chartData.data.map((item, idx) => {
            const heightPercent = (item.income / chartData.maxVal) * 100;
            const isSelectedMonth = (idx + 1) === parseInt(selectedMonth);
            
            return (
              <div key={idx} className="flex flex-col items-center gap-2 w-full h-full justify-end group cursor-pointer" onClick={() => setSelectedMonth(idx + 1)}>
                <div className="w-full h-[85%] relative flex items-end justify-center rounded-t-lg overflow-hidden bg-slate-100/50 dark:bg-white/5">
                  <div 
                    style={{ height: `${heightPercent || 2}%` }} 
                    className={`w-full rounded-t-lg transition-all duration-500 ${item.income > 0 ? (isSelectedMonth ? 'bg-amber-500' : 'bg-blue-600') : 'bg-slate-200 dark:bg-white/10'}`}
                  ></div>
                </div>
                <span className={`text-[10px] font-bold ${isSelectedMonth ? 'text-amber-500' : 'text-slate-400'}`}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- STATISTIKA VA QARZDORLAR --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kichik Statistikalar */}
        <div className="space-y-4">
          <div className={`p-5 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-800 font-bold"><Users size={24} /></div>
            <div>
              <p className="text-slate-400 font-bold text-[10px] uppercase">Jami O'quvchilar</p>
              <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{students.length}</h3>
            </div>
          </div>
          <div className={`p-5 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 font-bold"><AlertCircle size={24} /></div>
            <div>
              <p className="text-slate-400 font-bold text-[10px] uppercase">{months[selectedMonth-1].label} uchun qarzdorlar</p>
              <h3 className="text-2xl font-black text-rose-600">{debtors.length}</h3>
            </div>
          </div>
        </div>

        {/* Qarzdorlar Jadvali */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span className="w-2 h-6 bg-rose-500 rounded-full"></span>
              To'lov Kutilmoqda ({months[selectedMonth-1].label})
            </h3>
            <span className="px-2 py-1 bg-rose-100 text-rose-600 rounded-lg text-xs font-bold">{debtors.length} kishi</span>
          </div>

          <div className="overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
            {debtors.length > 0 ? (
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {debtors.map((s) => (
                    <tr key={s.id} className="group hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className={`py-3 font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{s.name}</td>
                      <td className="py-3"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold uppercase">{s.group}</span></td>
                      <td className="py-3 text-right">
                        <a href={`tel:${s.phone}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-green-500 hover:text-white text-slate-600 rounded-lg text-xs font-bold transition">
                          <Phone size={14}/> Tel
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-10 text-center text-slate-400">
                <p className="font-bold text-sm">Qarzdorlik yo'q 🎉</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};