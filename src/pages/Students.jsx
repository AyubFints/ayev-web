import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Search, Plus, Phone, Users, Trash2, Edit, 
  MoreVertical, X, CheckCircle2, AlertCircle, Clock 
} from 'lucide-react';

export const Students = () => {
  const { db, addStudent, deleteStudent, updateStudent, addPayment, theme } = useData();
  const isDark = theme === 'dark';

  const [modal, setModal] = useState(false);
  const [payModal, setPayModal] = useState(null); // Qaysi o'quvchi to'lov qilyapti
  const [editMode, setEditMode] = useState(null);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({ name: '', phone: '', group: '' });
  const [payAmount, setPayAmount] = useState('');

  // --- 🔥 MUHIM: KUNLARNI HISOBLASH FUNKSIYASI ---
  const getDaysLeft = (studentId) => {
    // 1. Shu o'quvchining barcha to'lovlarini olamiz
    const studentPayments = db.payments.filter(p => p.studentId === studentId);
    
    // 2. Agar to'lovi umuman yo'q bo'lsa
    if (studentPayments.length === 0) return -1; // -1 = To'lov yo'q

    // 3. Oxirgi to'lov sanasini topamiz
    // Bazada sana "15.02.2024" formatida. Uni to'g'irlaymiz.
    const lastPayment = studentPayments[studentPayments.length - 1]; // Eng oxirgi to'lov
    const [d, m, y] = lastPayment.date.split('.');
    
    const paymentDate = new Date(y, m - 1, d); // To'langan kun
    const today = new Date(); // Bugungi kun

    // 4. Oradan necha kun o'tganini hisoblaymiz
    const diffTime = Math.abs(today - paymentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // 5. 30 kundan ayiramiz
    const daysLeft = 30 - diffDays;

    return daysLeft; // Masalan: 29, 15 yoki -5 (qarzdor)
  };

  // Yangi o'quvchi qo'shish
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      updateStudent({ ...formData, id: editMode });
    } else {
      addStudent(formData);
    }
    setModal(false);
    setEditMode(null);
    setFormData({ name: '', phone: '', group: '' });
  };

  // To'lov qilish
  const handlePayment = (e) => {
    e.preventDefault();
    if (payModal && payAmount) {
      addPayment({
        studentId: payModal.id,
        studentName: payModal.name,
        amount: payAmount,
        // Sana avtomatik bugungi kun bo'ladi contextda
      });
      setPayModal(null);
      setPayAmount('');
    }
  };

  const filteredStudents = db.students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.group.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-20 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>O'quvchilar</h1>
           <p className="text-slate-500 font-bold">Jami: {db.students.length} ta o'quvchi</p>
        </div>
        <button 
          onClick={() => { setEditMode(null); setFormData({name:'', phone:'', group:''}); setModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition"
        >
          <Plus size={20}/> Yangi O'quvchi
        </button>
      </div>

      {/* Qidiruv */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl border mb-6 ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white border-slate-200'}`}>
         <Search className="text-slate-400"/>
         <input 
           className={`bg-transparent outline-none w-full font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}
           placeholder="Ism yoki guruh bo'yicha qidirish..."
           value={search}
           onChange={e => setSearch(e.target.value)}
         />
      </div>

      {/* RO'YXAT (GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => {
          
          // 🔥 Har bir o'quvchi uchun kunni hisoblaymiz
          const daysLeft = getDaysLeft(student.id);
          
          // Status rangini aniqlash
          let statusColor = "bg-slate-100 text-slate-500"; // Default (To'lov yo'q)
          let statusText = "To'lov yo'q";
          let statusIcon = <AlertCircle size={16}/>;

          if (daysLeft > 5) {
             statusColor = "bg-emerald-100 text-emerald-700 border-emerald-200";
             statusText = `${daysLeft} kun qoldi`;
             statusIcon = <Clock size={16}/>;
          } else if (daysLeft >= 0 && daysLeft <= 5) {
             statusColor = "bg-amber-100 text-amber-700 border-amber-200";
             statusText = `${daysLeft} kun qoldi (Oz qoldi)`;
             statusIcon = <AlertCircle size={16}/>;
          } else if (daysLeft < 0 && daysLeft > -100) {
             statusColor = "bg-rose-100 text-rose-700 border-rose-200";
             statusText = "To'lov tugagan!";
             statusIcon = <X size={16}/>;
          }

          return (
            <div key={student.id} className={`p-6 rounded-3xl border relative group hover:-translate-y-1 transition-all duration-300 ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200 hover:shadow-xl hover:shadow-blue-900/5'}`}>
               
               {/* Tepa qism: Avatar va Info */}
               <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">
                        {student.name.charAt(0)}
                     </div>
                     <div>
                        <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{student.name}</h3>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{student.group}</span>
                     </div>
                  </div>
                  
                  {/* Tahrirlash / O'chirish menyusi (Hoverda chiqadi) */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => { setEditMode(student.id); setFormData(student); setModal(true); }} className="p-2 bg-slate-100 hover:bg-blue-500 hover:text-white rounded-lg transition text-slate-400"><Edit size={16}/></button>
                     <button onClick={() => deleteStudent(student.id)} className="p-2 bg-slate-100 hover:bg-rose-500 hover:text-white rounded-lg transition text-slate-400"><Trash2 size={16}/></button>
                  </div>
               </div>

               {/* O'rta qism: Status (Kunlar) */}
               <div className={`mb-6 px-4 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm ${statusColor}`}>
                  {statusIcon} {statusText}
               </div>

               {/* Pastki qism: Telefon va To'lov tugmasi */}
               <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-slate-200 dark:border-white/10">
                  <a href={`tel:${student.phone}`} className="flex items-center gap-2 text-slate-400 hover:text-blue-500 font-bold text-sm transition">
                     <Phone size={16}/> {student.phone}
                  </a>
                  <button 
                    onClick={() => setPayModal(student)}
                    className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition flex items-center gap-2"
                  >
                     <CheckCircle2 size={14}/> To'lov
                  </button>
               </div>
            </div>
          );
        })}
      </div>

      {/* --- O'QUVCHI QO'SHISH MODAL --- */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
           <div className={`w-full max-w-md p-8 rounded-[32px] shadow-2xl ${isDark ? 'bg-[#161d31] border border-white/10' : 'bg-white'}`}>
              <h3 className={`text-2xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{editMode ? "Tahrirlash" : "Yangi O'quvchi"}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <input className={`w-full p-4 rounded-2xl border font-bold outline-none ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50'}`} placeholder="F.I.SH" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} required/>
                 <input className={`w-full p-4 rounded-2xl border font-bold outline-none ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50'}`} placeholder="Telefon (+998..)" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} required/>
                 <select className={`w-full p-4 rounded-2xl border font-bold outline-none cursor-pointer ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50'}`} value={formData.group} onChange={e=>setFormData({...formData, group:e.target.value})} required>
                    <option value="">Guruhni tanlang</option>
                    {db.groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                 </select>
                 <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setModal(false)} className="flex-1 py-4 font-bold text-slate-400 hover:bg-slate-100 rounded-2xl">Bekor qilish</button>
                    <button className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30">Saqlash</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* --- TO'LOV QILISH MODAL --- */}
      {payModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
           <div className={`w-full max-w-sm p-8 rounded-[32px] shadow-2xl text-center ${isDark ? 'bg-[#161d31] border border-white/10' : 'bg-white'}`}>
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                 <CheckCircle2 size={40}/>
              </div>
              <h3 className={`text-xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{payModal.name}</h3>
              <p className="text-slate-500 font-bold text-sm mb-6">Ushbu o'quvchi uchun to'lov qabul qilish</p>
              
              <form onSubmit={handlePayment}>
                 <input 
                   type="number" 
                   autoFocus
                   className={`w-full p-4 text-center text-2xl font-black rounded-2xl border outline-none mb-4 ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 text-slate-900'}`} 
                   placeholder="Summa..." 
                   value={payAmount} 
                   onChange={e=>setPayAmount(e.target.value)} 
                   required
                 />
                 <div className="flex gap-3">
                    <button type="button" onClick={() => setPayModal(null)} className="flex-1 py-3 font-bold text-slate-400 hover:bg-slate-100 rounded-xl">Yopish</button>
                    <button className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30">Tasdiqlash</button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};