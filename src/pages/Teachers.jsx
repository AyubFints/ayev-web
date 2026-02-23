import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Users, Wallet, Layers, TrendingUp, X, DollarSign, 
  Calendar, CheckCircle, AlertCircle, PieChart 
} from 'lucide-react';

export const Teachers = () => {
  // expenses va addExpense ni ham oldik
  const { groups, students, expenses, addExpense, theme } = useData();
  const isDark = theme === 'dark';

  // Oyni tanlash (Default: Hozirgi oy)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // "2023-10"
  
  // Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payData, setPayData] = useState({ teacherName: '', totalSalary: 0, paid: 0, amount: '' });

  const safeGroups = groups || [];
  const safeStudents = students || [];
  const safeExpenses = expenses || [];

  // --- 🔥 HISOBLASH LOGIKASI ---
  const teachersMap = {};

  safeGroups.forEach(group => {
    const rawName = group.teacher || "Noma'lum";
    const teacherName = rawName.trim(); 

    if (!teachersMap[teacherName]) {
      teachersMap[teacherName] = {
        name: teacherName,
        groupsCount: 0,
        totalStudents: 0,
        totalRevenue: 0,  
        totalSalary: 0,   // Jami hisoblangan oylik
        paidSalary: 0,    // To'lab berilgan qismi
        groupsList: []
      };
    }

    // 1. O'quvchilar soni va Tushum (Faqat tanlangan oy uchun emas, umumiy guruh narxidan hisoblaymiz, 
    // chunki o'qituvchi oyligi guruhdagi o'quvchi soniga bog'liq)
    const currentGroupStudents = safeStudents.filter(s => s.groupIds && s.groupIds.includes(group.id));
    const studentCount = currentGroupStudents.length;
    
    const price = parseInt(group.price) || 0;
    const groupRevenue = studentCount * price;
    
    const percent = parseInt(group.teacherPercent) || 0;
    const salary = (groupRevenue * percent) / 100;

    teachersMap[teacherName].groupsCount += 1;
    teachersMap[teacherName].totalStudents += studentCount;
    teachersMap[teacherName].totalRevenue += groupRevenue;
    teachersMap[teacherName].totalSalary += salary;
    teachersMap[teacherName].groupsList.push(group.name);
  });

  // --- 💰 TO'LANGAN PULLARNI HISOBLASH ---
  // Biz "Chiqimlar" (Expenses) ichidan qaraymiz: 
  // Agar sababi "Oylik: Ali Valiyev" bo'lsa va sanasi shu oyga to'g'ri kelsa -> demak bu oylik to'langan.
  Object.keys(teachersMap).forEach(name => {
    const teacherExpenses = safeExpenses.filter(e => 
      e.category === `Oylik: ${name}` && // Kategoriya yoki Sabab nomi
      e.date.startsWith(selectedMonth)   // Shu oy uchun
    );
    
    const paid = teacherExpenses.reduce((sum, e) => sum + (parseInt(e.amount) || 0), 0);
    teachersMap[name].paidSalary = paid;
  });

  const teachers = Object.values(teachersMap).sort((a, b) => b.totalSalary - a.totalSalary);

  // --- ACTIONS ---
  const openPayModal = (teacher) => {
    setPayData({
      teacherName: teacher.name,
      totalSalary: teacher.totalSalary,
      paid: teacher.paidSalary,
      amount: ''
    });
    setIsPayModalOpen(true);
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (!payData.amount) return alert("Summani kiriting!");

    // 1. Moliyaga chiqim qo'shish
    addExpense({
      amount: payData.amount,
      category: `Oylik: ${payData.teacherName}`, // 🔥 Moliya bo'limida shunday ko'rinadi
      date: new Date().toISOString().slice(0, 10), // Bugungi sana
      type: 'expense'
    });

    setIsPayModalOpen(false);
    alert("Oylik to'landi va chiqimlarga qo'shildi! ✅");
  };

  return (
    <div className={`p-10 min-h-screen pb-24 transition-all duration-300 ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            O'qituvchilar <span className="text-sm font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">{teachers.length} ta</span>
          </h1>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            KPI va Maoshlar nazorati
          </p>
        </div>

        {/* OY TANLASH */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white border-slate-200'}`}>
           <Calendar size={18} className="text-slate-400"/>
           <input 
             type="month" 
             value={selectedMonth}
             onChange={(e) => setSelectedMonth(e.target.value)}
             className={`bg-transparent outline-none font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
           />
        </div>
      </div>

      {/* KARTOCHKALAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teachers.length > 0 ? teachers.map((t, idx) => {
          
          // Hisob-kitoblar
          const remaining = t.totalSalary - t.paidSalary;
          const percentPaid = t.totalSalary > 0 ? Math.round((t.paidSalary / t.totalSalary) * 100) : 0;
          const isFullyPaid = remaining <= 0 && t.totalSalary > 0;

          return (
            <div key={idx} className={`relative p-6 rounded-[32px] border overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl ${isDark ? 'bg-[#161d31] border-white/5 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200'}`}>
               
               {/* Header */}
               <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg ${isDark ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-400' : 'bg-gradient-to-br from-cyan-100 to-blue-50 text-cyan-600'}`}>
                     {t.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                     <h3 className="text-xl font-bold truncate">{t.name}</h3>
                     <p className={`text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {t.groupsCount} ta guruh • {t.totalStudents} ta o'quvchi
                     </p>
                  </div>
               </div>

               {/* 📊 PROGRESS BAR (FOIZ) */}
               <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                     <p className="text-xs font-bold text-slate-500 uppercase">To'lov holati</p>
                     <p className={`text-sm font-black ${isFullyPaid ? 'text-emerald-500' : 'text-orange-500'}`}>
                        {percentPaid}% to'landi
                     </p>
                  </div>
                  <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-black/20' : 'bg-slate-100'}`}>
                     <div 
                       className={`h-full rounded-full transition-all duration-1000 ${isFullyPaid ? 'bg-emerald-500' : 'bg-gradient-to-r from-orange-500 to-yellow-500'}`} 
                       style={{ width: `${Math.min(percentPaid, 100)}%` }}
                     ></div>
                  </div>
               </div>

               {/* MOLIYA STATISTIKASI */}
               <div className={`p-5 rounded-2xl border mb-4 ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs text-slate-500 font-bold">Jami hisoblangan:</span>
                     <span className="font-bold">{t.totalSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs text-slate-500 font-bold">To'lab berildi:</span>
                     <span className="font-bold text-emerald-500">
                        {t.paidSalary > 0 ? '+' : ''}{t.paidSalary.toLocaleString()}
                     </span>
                  </div>
                  <div className="w-full h-[1px] bg-slate-500/20 my-2"></div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-slate-500 font-bold">Qolgan qarz:</span>
                     <span className={`font-black text-lg ${remaining > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                        {remaining.toLocaleString()}
                     </span>
                  </div>
               </div>

               {/* TO'LASH TUGMASI */}
               <button 
                 onClick={() => openPayModal(t)}
                 disabled={isFullyPaid}
                 className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition active:scale-95 ${
                   isFullyPaid 
                     ? 'bg-emerald-500/10 text-emerald-500 cursor-default' 
                     : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
                 }`}
               >
                 {isFullyPaid ? <><CheckCircle size={18}/> To'liq to'langan</> : <><DollarSign size={18}/> Oylik Berish</>}
               </button>

            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center text-slate-500 opacity-50 flex flex-col items-center">
             <Layers size={64} className="mx-auto mb-4"/>
             <p className="text-xl font-bold">Ma'lumot yo'q</p>
          </div>
        )}
      </div>

      {/* 💰 OYLIK BERISH MODALI */}
      {isPayModalOpen && (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className={`w-full max-w-md p-8 rounded-[32px] border shadow-2xl scale-100 animate-in zoom-in-95 ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white'}`}>
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-emerald-500 flex items-center gap-2"><Wallet /> Oylik Berish</h2>
                 <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-rose-500"><X /></button>
               </div>
               
               <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold">{payData.teacherName}</h3>
                  <p className="text-sm text-slate-500">Jami qarz: <span className="text-rose-500 font-bold">{(payData.totalSalary - payData.paid).toLocaleString()} UZS</span></p>
               </div>
               
               <form onSubmit={handlePaySubmit} className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500 uppercase ml-1">Summa (Necha pul berasiz?)</label>
                     <input type="number" placeholder="Summa (UZS)" className={`w-full p-4 rounded-2xl outline-none border font-bold text-lg text-emerald-500 ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`} value={payData.amount} onChange={e => setPayData({...payData, amount: e.target.value})} required />
                  </div>
                  
                  {/* Avtomatik izoh */}
                  <div className={`p-4 rounded-2xl text-center text-xs font-bold border ${isDark ? 'bg-[#0b1120] border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                     Bu summa avtomatik ravishda <br/> "Moliya" bo'limiga <b>Chiqim</b> sifatida qo'shiladi.
                  </div>

                  <button type="submit" className="w-full py-4 rounded-2xl font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition active:scale-95">Tasdiqlash</button>
               </form>
            </div>
         </div>
      )}

    </div>
  );
};