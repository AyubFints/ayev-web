import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  TrendingUp, TrendingDown, Wallet, 
  BarChart3, Users, AlertCircle, 
  Phone, Calendar 
} from 'lucide-react';

export const Dashboard = () => {
  const { db, theme } = useData();
  const isDark = theme === 'dark';

  // --- XAVFSIZLIK: Ma'lumot yuklanmaguncha kutamiz ---
  if (!db) return <div className="p-10 text-center font-bold text-slate-500">Yuklanmoqda...</div>;

  // 1. MA'LUMOTLARNI OLISH
  const students = db.students || [];
  const groups = db.groups || [];
  const payments = db.payments || [];
  const expenses = db.expenses || [];

  // --- 2. OY VA YILNI TANLASH ---
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

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

  // Joriy oyni xavfsiz aniqlash
  const currentMonthIndex = parseInt(selectedMonth) - 1;
  const currentMonthName = months[currentMonthIndex >= 0 && currentMonthIndex <= 11 ? currentMonthIndex : 0].label;

  // --- 3. FILTRLASH LOGIKASI ---
  const filterByDate = (items) => {
    return items.filter(item => {
       if (!item.date) return false;
       const parts = item.date.split('.'); 
       if (parts.length !== 3) return false;
       const itemMonth = parseInt(parts[1]); 
       const itemYear = parseInt(parts[2]);  

       return itemMonth === parseInt(selectedMonth) && itemYear === parseInt(selectedYear);
    });
  };

  const monthlyPayments = filterByDate(payments);
  const monthlyExpenses = filterByDate(expenses);

  // --- 4. HISOB-KITOB ---
  const totalIncome = monthlyPayments.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
  const totalExpense = monthlyExpenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
  const netProfit = totalIncome - totalExpense;

  const debtors = useMemo(() => {
    return students.filter(student => {
      const hasPaid = payments.some(p => {
        if (!p.date) return false;
        const parts = p.date.split('.');
        if (parts.length !== 3) return false;
        return p.studentId === student.id && 
               Number(parts[1]) === parseInt(selectedMonth) && 
               Number(parts[2]) === parseInt(selectedYear);
      });
      return !hasPaid;
    });
  }, [students, payments, selectedMonth, selectedYear]);

  const chartData = useMemo(() => {
      const data = months.map(m => ({ label: m.label.slice(0, 3), income: 0 }));
      payments.forEach(p => {
        if (!p.date) return;
        const parts = p.date.split('.');
        if (parts.length !== 3) return;
        const [d, m, y] = parts;
        if (Number(y) === parseInt(selectedYear)) {
            data[Number(m) - 1].income += Number(p.amount || 0);
        }
      });
      const maxVal = Math.max(...data.map(d => d.income)) || 1;
      return { data, maxVal };
  }, [payments, selectedYear]);

  // 🔥 FAQAT 3 TA MOLIYAVIY KARTA QOLDI
  const cards = [
    { title: `Tushum (${currentMonthName})`, value: `+${totalIncome.toLocaleString()} UZS`, icon: TrendingUp, color: "bg-emerald-500", sub: "Kassaga kirgan pul" },
    { title: `Xarajatlar (${currentMonthName})`, value: `-${totalExpense.toLocaleString()} UZS`, icon: TrendingDown, color: "bg-rose-500", sub: "Markazdan chiqib ketgan" },
    { title: `Sof Foyda (${currentMonthName})`, value: `${netProfit > 0 ? '+' : ''}${netProfit.toLocaleString()} UZS`, icon: Wallet, color: netProfit >= 0 ? "bg-indigo-500" : "bg-rose-500", sub: "Yonga qolgan pul" },
  ];

  return (
    <div className="pb-20 animate-in fade-in duration-500">
      
      {/* HEADER VA FILTR */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Boshqaruv Paneli</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
             <Calendar size={16}/> Hozirgi oy: <span className="font-bold text-blue-500">{currentMonthName}</span>
          </p>
        </div>
        
        {/* OY VA YIL TANLASH MENYUSI */}
        <div className="flex gap-3">
            <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`px-4 py-3 rounded-xl font-bold border outline-none cursor-pointer transition focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-[#161d31] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
            >
                {months.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))}
            </select>
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

      {/* --- MOLIYA KARTALARI (Endi 3 ta qatorli grid-cols-3 bo'ldi) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => {
          const IconComponent = card.icon; 
          return (
            <div key={index} className={`p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all border ${isDark ? 'bg-[#161d31] border-white/5 shadow-none' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <div className={`absolute right-0 top-0 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition group-hover:scale-110 ${isDark ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-slate-100 to-transparent'}`}></div>
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-xl text-white shadow-lg ${card.color}`}>
                  <IconComponent size={24} />
                </div>
              </div>
              
              <p className={`text-sm font-medium relative z-10 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {card.title}
              </p>
              
              <h3 className={`text-xl lg:text-2xl font-black mt-1 truncate relative z-10 ${isDark ? 'text-white' : 'text-slate-900'}`} title={card.value.toString()}>
                {card.value}
              </h3>
              
              <p className="text-xs text-slate-400 mt-2 relative z-10">
                {card.sub}
              </p>
            </div>
          )
        })}
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
              <p className="text-slate-400 font-bold text-[10px] uppercase">{currentMonthName} uchun qarzdorlar</p>
              <h3 className="text-2xl font-black text-rose-600">{debtors.length}</h3>
            </div>
          </div>
        </div>

        <div className={`lg:col-span-2 p-6 rounded-3xl border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span className="w-2 h-6 bg-rose-500 rounded-full"></span>
              To'lov Kutilmoqda ({currentMonthName})
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