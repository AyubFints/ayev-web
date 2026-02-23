import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Trophy, Medal, Calendar, Crown, Star, Flame } from 'lucide-react';

export const Champions = () => {
  const { students, theme } = useData();
  const isDark = theme === 'dark';

  const [view, setView] = useState('month'); // 'week' | 'month'
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const safeStudents = students || [];

  // --- REYTING LOGIKASI ---
  const getLeaderboard = () => {
    return safeStudents.map(student => {
      const history = student.pointHistory || [];
      let filteredPoints = 0;
      
      if (view === 'month') {
        filteredPoints = history
          .filter(h => h.date && h.date.startsWith(selectedMonth))
          .reduce((sum, h) => sum + parseInt(h.points), 0);
      } else {
        // Oxirgi 7 kun
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const isoWeek = oneWeekAgo.toISOString().split('T')[0];
        filteredPoints = history
          .filter(h => h.date >= isoWeek)
          .reduce((sum, h) => sum + parseInt(h.points), 0);
      }
      return { ...student, points: filteredPoints };
    })
    .filter(s => s.points > 0)
    .sort((a, b) => b.points - a.points);
  };

  const leaders = getLeaderboard();

  return (
    <div className={`p-10 min-h-screen pb-24 transition-all duration-300 ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Trophy className="text-amber-400 fill-amber-400" size={40} /> Chempionlar
          </h1>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Eng faol o'quvchilar reytingi
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
           {view === 'month' && (
            <input 
              type="month" 
              value={selectedMonth} 
              onChange={e => setSelectedMonth(e.target.value)}
              className={`p-2 rounded-xl text-sm font-bold outline-none border-none ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-100 text-slate-900'}`}
            />
           )}
           <div className="flex bg-slate-100 dark:bg-black/20 rounded-xl p-1">
             <button onClick={() => setView('week')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'week' ? 'bg-white dark:bg-slate-700 shadow text-cyan-600' : 'text-slate-500'}`}>Hafta</button>
             <button onClick={() => setView('month')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'month' ? 'bg-white dark:bg-slate-700 shadow text-cyan-600' : 'text-slate-500'}`}>Oy</button>
           </div>
        </div>
      </div>

      {/* 🏆 PODIUM (1, 2, 3 O'RINLAR) */}
      <div className="flex justify-center items-end gap-4 md:gap-8 mb-16 px-4">
        
        {/* 🥈 2-O'RIN (SILVER) */}
        {leaders[1] ? (
          <div className="flex flex-col items-center group w-1/3 max-w-[200px]">
             <div className="relative mb-4">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-slate-300 bg-slate-100 flex items-center justify-center overflow-hidden shadow-2xl shadow-slate-400/50">
                  <span className="text-4xl font-black text-slate-400">{leaders[1].name.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">2-o'rin</div>
             </div>
             <div className={`w-full p-6 rounded-t-[32px] text-center h-48 md:h-64 flex flex-col justify-end pb-6 shadow-xl ${isDark ? 'bg-gradient-to-b from-slate-700 to-[#0b1120]' : 'bg-gradient-to-b from-slate-200 to-white'}`}>
                <h3 className="font-bold text-lg md:text-xl truncate w-full">{leaders[1].name}</h3>
                <p className="font-black text-2xl text-slate-500 mt-1">{leaders[1].points} XP</p>
             </div>
          </div>
        ) : <div className="w-1/3"></div>}

        {/* 🥇 1-O'RIN (GOLD) */}
        {leaders[0] ? (
          <div className="flex flex-col items-center group w-1/3 max-w-[240px] -mt-10 z-10">
             <Crown size={48} className="text-amber-400 fill-amber-400 mb-2 animate-bounce" />
             <div className="relative mb-4">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-amber-400 bg-amber-100 flex items-center justify-center overflow-hidden shadow-2xl shadow-amber-500/50 ring-4 ring-amber-400/30">
                  <span className="text-5xl font-black text-amber-500">{leaders[0].name.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                   <Star size={12} fill="white"/> 1-o'rin
                </div>
             </div>
             <div className={`w-full p-6 rounded-t-[40px] text-center h-60 md:h-80 flex flex-col justify-end pb-8 shadow-2xl ${isDark ? 'bg-gradient-to-b from-amber-600 to-[#0b1120]' : 'bg-gradient-to-b from-amber-200 to-white'}`}>
                <h3 className="font-black text-xl md:text-2xl truncate w-full">{leaders[0].name}</h3>
                <p className="font-black text-3xl text-amber-600 mt-2">{leaders[0].points} XP</p>
                <div className="mt-4 flex justify-center"><Flame className="text-orange-500 animate-pulse" /></div>
             </div>
          </div>
        ) : (
          <div className="col-span-3 text-center py-20 opacity-50 w-full">
             <Trophy size={64} className="mx-auto mb-4"/>
             <p>Hozircha ballar yo'q</p>
          </div>
        )}

        {/* 🥉 3-O'RIN (BRONZE) */}
        {leaders[2] ? (
          <div className="flex flex-col items-center group w-1/3 max-w-[200px]">
             <div className="relative mb-4">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-orange-400 bg-orange-100 flex items-center justify-center overflow-hidden shadow-2xl shadow-orange-500/30">
                  <span className="text-4xl font-black text-orange-500">{leaders[2].name.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">3-o'rin</div>
             </div>
             <div className={`w-full p-6 rounded-t-[32px] text-center h-40 md:h-52 flex flex-col justify-end pb-6 shadow-xl ${isDark ? 'bg-gradient-to-b from-orange-800 to-[#0b1120]' : 'bg-gradient-to-b from-orange-200 to-white'}`}>
                <h3 className="font-bold text-lg md:text-xl truncate w-full">{leaders[2].name}</h3>
                <p className="font-black text-2xl text-orange-600 mt-1">{leaders[2].points} XP</p>
             </div>
          </div>
        ) : <div className="w-1/3"></div>}

      </div>

      {/* 📜 QOLGANLAR RO'YXATI */}
      {leaders.length > 3 && (
        <div className={`max-w-4xl mx-auto rounded-[32px] border overflow-hidden ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className={`p-6 border-b font-bold flex items-center gap-2 ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
             <Star size={18} className="text-slate-400"/> Kuchli o'nlik (Top 10)
          </div>
          {leaders.slice(3, 10).map((l, idx) => (
            <div key={l.id} className={`flex items-center justify-between p-6 border-b last:border-0 transition-colors ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}>
               <div className="flex items-center gap-6">
                  <span className="text-lg font-black text-slate-300 w-8 text-center">#{idx + 4}</span>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                      {l.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{l.name}</h3>
                      <p className="text-xs text-slate-500">ID: {l.id}</p>
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-500/10">
                  <span className="font-black text-xl text-slate-500">{l.points} XP</span>
               </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};