import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Calendar, Check, X, Minus, UserCheck, Search, ShieldCheck, Clock } from 'lucide-react';

export const Attendance = () => {
  // 🔥 Xatolikni oldini olish uchun db ni chaqiramiz
  const { db, markAttendance, theme } = useData();
  const isDark = theme === 'dark';

  // --- MA'LUMOTLARNI XAVFSIZ OLISH ---
  const groups = db?.groups || [];
  const students = db?.students || [];
  const attendance = db?.attendance || [];

  // --- BUGUNGI KUNNI ANIQLASH MANTIG'I ---
  const todayDay = new Date().getDay();
  const isDushanbaType = [1, 3, 5].includes(todayDay); // 1-Dush, 3-Chor, 5-Juma
  const isSeshanbaType = [2, 4, 6].includes(todayDay); // 2-Sesh, 4-Pay, 6-Shanba

  // --- GURUHLARNI AVTOMATIK FILTRLASH ---
  const todaysGroups = groups.filter(group => {
    if (isDushanbaType) return group.days === 'Dushanba';
    if (isSeshanbaType) return group.days === 'Seshanba';
    return false;
  });

  // --- STATE ---
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState('');

  // Sahifaga kirganda birinchi guruhni tanlash
  useEffect(() => {
    if (todaysGroups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(todaysGroups[0].id.toString());
    }
  }, [todaysGroups]);

  // 🔥 MUHIM: Agar db hali yuklanmagan bo'lsa, oq ekran o'rniga "Yuklanmoqda" chiqadi
  if (!db) return <div className="p-10 text-center font-bold">Yuklanmoqda...</div>;

  // --- MANTIQ ---
  const groupStudents = students.filter(s => {
    const matchSearch = (s.name || '').toLowerCase().includes(search.toLowerCase());
    
    let matchGroup = false;
    // ID bo'yicha yoki nomi bo'yicha tekshirish (Universal)
    const currentGroup = groups.find(g => g.id.toString() === selectedGroupId.toString());
    if (currentGroup && s.group === currentGroup.name) matchGroup = true;
    if (s.groupId?.toString() === selectedGroupId.toString()) matchGroup = true;

    return matchGroup && matchSearch;
  });

  const getStatus = (studentId) => {
    const record = attendance.find(a => 
      a.date === selectedDate && 
      a.studentId === studentId && 
      a.groupId?.toString() === selectedGroupId.toString()
    );
    return record ? record.status : null;
  };

  const handleMark = (studentId, status) => {
    if (markAttendance) {
      markAttendance(selectedDate, selectedGroupId, studentId, status);
    }
  };

  return (
    <div className={`p-6 min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-[#0b1120] text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className={`text-3xl font-black flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Davomat
          </h1>
          <p className={`font-bold mt-1 ${isDushanbaType || isSeshanbaType ? 'text-emerald-500' : 'text-slate-500'}`}>
            {isDushanbaType ? "📌 Bugun: Dushanba, Chorshanba, Juma" 
            : isSeshanbaType ? "📌 Bugun: Seshanba, Payshanba, Shanba" 
            : "Bugun darslar yo'q"}
          </p>
        </div>
        
        <div className={`flex items-center px-4 py-2 rounded-xl border ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white border-slate-200'}`}>
           <Calendar size={18} className="mr-2 text-blue-500"/>
           <input 
             type="date" 
             value={selectedDate} 
             onChange={(e) => setSelectedDate(e.target.value)} 
             className="bg-transparent outline-none font-bold"
           />
        </div>
      </div>

      {/* FILTRLAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
         <div className="relative">
           <select 
             value={selectedGroupId} 
             onChange={(e) => setSelectedGroupId(e.target.value)}
             className={`w-full p-4 pl-12 rounded-2xl outline-none border font-bold appearance-none cursor-pointer transition-all focus:border-blue-500 ${isDark ? 'bg-[#161d31] border-white/5 text-white' : 'bg-white border-slate-200'}`}
           >
              {todaysGroups.length > 0 ? todaysGroups.map(g => (
                <option key={g.id} value={g.id}>{g.name} ({g.time})</option>
              )) : <option value="">Bugun guruhlar yo'q</option>}
           </select>
           <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
         </div>

         <div className={`flex items-center px-4 py-3 rounded-2xl border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
            <Search className="text-slate-400 mr-2"/>
            <input 
              placeholder="Qidirish..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full bg-transparent outline-none font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}
            />
         </div>
      </div>

      {/* DAVOMAT RO'YXATI */}
      {todaysGroups.length > 0 ? (
        <div className={`rounded-[32px] border overflow-hidden shadow-sm ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
           {groupStudents.length > 0 ? (
             <div className="divide-y divide-slate-200 dark:divide-white/5">
               {groupStudents.map((student, idx) => {
                 const status = getStatus(student.id);

                 return (
                   <div key={student.id} className={`p-4 flex flex-col lg:flex-row items-center justify-between gap-4 transition ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-4 w-full lg:w-auto">
                         <span className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center font-bold text-slate-500">{idx + 1}</span>
                         <div>
                            <h3 className={`font-bold text-lg leading-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{student.name}</h3>
                            <p className="text-xs text-slate-500 font-medium">{student.phone}</p>
                         </div>
                      </div>

                      <div className="flex gap-2 w-full lg:w-auto justify-center">
                         <button onClick={() => handleMark(student.id, 'present')} className={`flex-1 lg:flex-none px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition border-2 ${status === 'present' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30' : `border-emerald-500/20 text-emerald-500`}`}>
                            <Check size={18}/> Bor
                         </button>
                         <button onClick={() => handleMark(student.id, 'reason')} className={`flex-1 lg:flex-none px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition border-2 ${status === 'reason' ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/30' : `border-amber-500/20 text-amber-500`}`}>
                            <Minus size={18}/> Sababli
                         </button>
                         <button onClick={() => handleMark(student.id, 'absent')} className={`flex-1 lg:flex-none px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition border-2 ${status === 'absent' ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30' : `border-rose-500/20 text-rose-500`}`}>
                            <X size={18}/> Yo'q
                         </button>
                      </div>
                   </div>
                 );
               })}
             </div>
           ) : (
             <div className="p-16 text-center text-slate-500 italic">Guruhda o'quvchilar yo'q.</div>
           )}
        </div>
      ) : (
        <div className="p-16 text-center font-bold opacity-50">Bugun darslar yo'q.</div>
      )}

    </div>
  );
};