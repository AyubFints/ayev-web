import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Calendar, Check, X, Minus, UserCheck, Search } from 'lucide-react';

export const Attendance = () => {
  const { groups, students, attendance, markAttendance, theme } = useData();
  const isDark = theme === 'dark';

  // --- STATE ---
  const [selectedGroupId, setSelectedGroupId] = useState(groups.length > 0 ? groups[0].id : '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState('');

  // --- MANTIQ ---
  
  // 1. Tanlangan guruhdagi o'quvchilarni topamiz (Universal Filtr bilan)
  const groupStudents = students.filter(s => {
    // Ism bo'yicha qidiruv
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    
    // Guruh bo'yicha filtr (Yangi va Eski format)
    let matchGroup = false;
    if (s.groupId && parseInt(s.groupId) === parseInt(selectedGroupId)) matchGroup = true;
    if (s.groupIds && s.groupIds.includes(parseInt(selectedGroupId))) matchGroup = true;

    return matchGroup && matchSearch;
  });

  // 2. O'quvchining bugungi statusini olish
  const getStatus = (studentId) => {
    const record = attendance.find(a => 
      a.date === selectedDate && 
      a.studentId === studentId && 
      parseInt(a.groupId) === parseInt(selectedGroupId)
    );
    return record ? record.status : null; // 'present', 'absent', 'reason', yoki null
  };

  // 3. Davomat qilish (BUTTON BOSILGANDA)
  const handleMark = (studentId, status) => {
    markAttendance(selectedDate, parseInt(selectedGroupId), studentId, status);
  };

  return (
    <div className={`p-6 min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-[#0b1120] text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Davomat</h1>
          <p className="text-slate-500">O'quvchilar ishtirokini belgilash</p>
        </div>
        
        {/* SANA TANLASH */}
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
         {/* Guruh tanlash */}
         <select 
           value={selectedGroupId} 
           onChange={(e) => setSelectedGroupId(e.target.value)}
           className={`w-full p-4 rounded-2xl outline-none border font-bold ${isDark ? 'bg-[#161d31] border-white/5 text-white' : 'bg-white border-slate-200'}`}
         >
            {groups.length > 0 ? groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            )) : <option>Guruhlar yo'q</option>}
         </select>

         {/* Qidirish */}
         <div className={`flex items-center px-4 py-3 rounded-2xl border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
            <Search className="text-slate-400 mr-2"/>
            <input 
              placeholder="O'quvchini qidirish..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none font-medium"
            />
         </div>
      </div>

      {/* DAVOMAT RO'YXATI */}
      <div className={`rounded-[32px] border overflow-hidden shadow-sm ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
         {groupStudents.length > 0 ? (
           <div className="divide-y divide-white/5">
             {groupStudents.map((student, idx) => {
               const status = getStatus(student.id);

               return (
                 <div 
                   key={student.id} 
                   className={`p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                   // 🔥 MUHIM: Bu yerda onClick={navigate} YO'Q! Shuning uchun bosganda hech qayerga ketmaydi.
                 >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                       <span className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center font-bold text-sm text-slate-500">{idx + 1}</span>
                       <div>
                          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{student.name}</h3>
                          <p className="text-xs text-slate-500">{student.phone}</p>
                       </div>
                    </div>

                    {/* TUGMALAR (BUTTONS) */}
                    <div className="flex gap-2 w-full md:w-auto justify-center">
                       
                       {/* 1. BOR (PRESENT) */}
                       <button 
                         onClick={() => handleMark(student.id, 'present')}
                         className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition border-2 ${
                           status === 'present' 
                             ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30' 
                             : `border-emerald-500/20 text-emerald-500 ${isDark ? 'hover:bg-emerald-500/10' : 'hover:bg-emerald-50'}`
                         }`}
                       >
                          <Check size={20}/> <span className="hidden sm:inline">Bor</span>
                       </button>

                       {/* 2. SABABLI (REASON) */}
                       <button 
                         onClick={() => handleMark(student.id, 'reason')}
                         className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition border-2 ${
                           status === 'reason' 
                             ? 'bg-yellow-500 text-white border-yellow-500 shadow-lg shadow-yellow-500/30' 
                             : `border-yellow-500/20 text-yellow-500 ${isDark ? 'hover:bg-yellow-500/10' : 'hover:bg-yellow-50'}`
                         }`}
                       >
                          <Minus size={20}/> <span className="hidden sm:inline">Sababli</span>
                       </button>

                       {/* 3. YO'Q (ABSENT) */}
                       <button 
                         onClick={() => handleMark(student.id, 'absent')}
                         className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition border-2 ${
                           status === 'absent' 
                             ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30' 
                             : `border-rose-500/20 text-rose-500 ${isDark ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50'}`
                         }`}
                       >
                          <X size={20}/> <span className="hidden sm:inline">Yo'q</span>
                       </button>

                    </div>
                 </div>
               );
             })}
           </div>
         ) : (
           <div className="p-16 text-center text-slate-500">
              <UserCheck size={48} className="mx-auto mb-4 opacity-50"/>
              <p>Bu guruhda o'quvchilar yo'q.</p>
           </div>
         )}
      </div>
    </div>
  );
};