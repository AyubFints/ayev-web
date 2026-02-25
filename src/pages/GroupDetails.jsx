import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, UserPlus, Trash2, Edit, X, Phone, 
  CheckCircle2, XCircle, DollarSign, Calendar, Clock, 
  CreditCard, Save
} from 'lucide-react';

export const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { db, addStudent, deleteStudent, updateStudent, addPayment, updateGroup, theme } = useData();
  const isDark = theme === 'dark';

  // --- STATELAR ---
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [payModal, setPayModal] = useState(false);
  
  // Guruhni tahrirlash uchun state
  const [groupEditModal, setGroupEditModal] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: '', teacher: '', days: '', time: '', price: '' });

  const [newSt, setNewSt] = useState({ name: '', phone: '' });
  const [editSt, setEditSt] = useState(null);
  const [paySt, setPaySt] = useState(null);
  const [amount, setAmount] = useState('');

  // 1. XAVFSIZLIK (🔥 To'g'rilandi)
  if (!db || !db.groups) return <div className="p-10 font-bold text-slate-500">Ma'lumotlar yuklanmoqda...</div>;

  // 2. GURUHNI TOPISH (ID larni string qilib solishtirish xavfsizroq)
  const group = db.groups.find(g => g.id.toString() === id.toString());

  if (!group) return <div className="p-10 text-center font-bold text-rose-500">Guruh topilmadi!</div>;

  // 3. O'QUVCHILAR (🔥 Xavfsiz chaqirildi)
  const students = (db.students || []).filter(s => s.group === group.name);

  // 4. BARCHA O'QITUVCHILAR RO'YXATI (🔥 Xavfsiz chaqirildi)
  const allTeachers = [...new Set((db.groups || []).map(g => g.teacher))];

  // --- FUNKSIYALAR ---

  const openGroupEdit = () => {
    setGroupForm(group); 
    setGroupEditModal(true);
  };

  const handleGroupSave = (e) => {
    e.preventDefault();
    if (groupForm.teacher !== group.teacher) {
       const confirmChange = window.confirm(`Diqqat! O'qituvchini "${group.teacher}"dan "${groupForm.teacher}"ga o'zgartirmoqchimisiz?`);
       if (!confirmChange) return;
    }
    updateGroup(groupForm);
    setGroupEditModal(false);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if(newSt.name){
      addStudent({ ...newSt, group: group.name });
      setNewSt({ name: '', phone: '' });
      setAddModal(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    updateStudent(editSt);
    setEditModal(false);
  };

  const handlePay = (e) => {
    e.preventDefault();
    addPayment({ 
      studentId: paySt.id, studentName: paySt.name, 
      amount, date: new Date().toLocaleDateString('ru-RU') // Sanani to'g'ri formatlash
    });
    setPayModal(false);
  };

  // 🔥 Xavfsiz chaqirildi
  const checkPaid = (sId) => {
    const d = new Date();
    return (db.payments || []).some(p => {
       if (!p.date) return false;
       const parts = p.date.split('.');
       if (parts.length !== 3) return false;
       return p.studentId === sId && Number(parts[1]) === d.getMonth() + 1 && Number(parts[2]) === d.getFullYear();
    });
  };

  return (
    <div className="pb-20 animate-in fade-in duration-500">
      
      {/* HEADER & ORTGA */}
      <button onClick={() => navigate('/groups')} className="mb-6 text-slate-500 hover:text-blue-500 font-bold flex items-center gap-2 transition">
        <ArrowLeft size={20}/> Guruhlarga qaytish
      </button>
      
      {/* GURUH KARTASI (INFO) */}
      <div className={`p-8 rounded-[32px] shadow-lg mb-8 border relative overflow-hidden group hover:shadow-xl transition-all ${isDark ? 'bg-gradient-to-r from-blue-900/40 to-[#161d31] border-white/10 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30'}`}>
        
        <button 
          onClick={openGroupEdit}
          className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition backdrop-blur-md border border-white/10"
          title="Guruhni tahrirlash"
        >
          <Edit size={20}/>
        </button>

        <div className="relative z-10">
           <h1 className="text-4xl font-black mb-2">{group.name}</h1>
           <p className="opacity-90 font-bold text-lg mb-6 flex items-center gap-2">
             <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">O'qituvchi: {group.teacher || "Kiritilmagan"}</span>
           </p>
           
           <div className="flex gap-3 flex-wrap">
             <div className="px-4 py-3 bg-white/20 backdrop-blur-md rounded-2xl font-bold text-sm flex items-center gap-2 border border-white/10">
                <Calendar size={18}/> {group.days}
             </div>
             <div className="px-4 py-3 bg-white/20 backdrop-blur-md rounded-2xl font-bold text-sm flex items-center gap-2 border border-white/10">
                <Clock size={18}/> {group.time}
             </div>
             <div className="px-4 py-3 bg-white text-blue-600 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg">
                <DollarSign size={18}/> {Number(group.price).toLocaleString()} so'm
             </div>
           </div>
        </div>
      </div>

      {/* RO'YXAT BOSHI */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
          O'quvchilar ({students.length})
        </h2>
        <button onClick={() => setAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 active:scale-95 transition">
          <UserPlus size={20}/> Qo'shish
        </button>
      </div>

      {/* --- O'QUVCHILAR KARTALARI --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length > 0 ? students.map((s) => {
           const isPaid = checkPaid(s.id);
           return (
             <div key={s.id} className={`p-6 rounded-[32px] border transition-all hover:shadow-xl hover:-translate-y-1 relative group ${isDark ? 'bg-[#161d31] border-white/5 hover:border-blue-500/30' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg ${isPaid ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-rose-500 text-white shadow-rose-500/30'}`}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className={`text-lg font-black leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{s.name}</h3>
                      <p className="text-xs text-slate-400 font-bold mt-1">ID: {s.id.toString().slice(-4)}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                   <div className={`flex items-center gap-3 p-3 rounded-2xl ${isDark ? 'bg-black/20' : 'bg-slate-50'}`}>
                      <Phone size={18} className="text-slate-400"/>
                      <span className={`font-bold text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{s.phone}</span>
                   </div>
                   <div className={`flex items-center gap-3 p-3 rounded-2xl border ${isPaid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-rose-500/10 border-rose-500/20 text-rose-600'}`}>
                      {isPaid ? <CheckCircle2 size={18}/> : <XCircle size={18}/>}
                      <span className="font-bold text-sm">{isPaid ? "30 kunga to'landi ✅" : "To'lov qilinmagan ❌"}</span>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => { setPaySt(s); setAmount(group.price); setPayModal(true); }} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition">
                     <CreditCard size={18}/> To'lash
                   </button>
                   <button onClick={() => { setEditSt(s); setEditModal(true); }} className={`p-3 rounded-xl transition ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}><Edit size={18}/></button>
                   <button onClick={() => { if(window.confirm("O'chirasizmi?")) deleteStudent(s.id) }} className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 transition"><Trash2 size={18}/></button>
                </div>
             </div>
           )
        }) : (
          <div className="col-span-full p-10 text-center text-slate-400 font-bold bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">Bu guruhda o'quvchilar yo'q.</div>
        )}
      </div>

      {/* --- MODAL: GURUHNI TAHRIRLASH --- */}
      {groupEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className={`w-full max-w-md p-8 rounded-[32px] shadow-2xl ${isDark ? 'bg-[#161d31] border border-white/10' : 'bg-white'}`}>
             <div className="flex justify-between items-center mb-6">
               <h3 className={`font-black text-xl ${isDark?'text-white':'text-slate-900'}`}>Guruhni Tahrirlash</h3>
               <button onClick={() => setGroupEditModal(false)}><X className="text-slate-400 hover:text-rose-500 transition"/></button>
             </div>
             
             <form onSubmit={handleGroupSave} className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">Guruh Nomi</label>
                  <input className={`w-full p-4 mt-1 rounded-2xl border outline-none font-bold focus:border-blue-500 transition-all ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={groupForm.name} onChange={e=>setGroupForm({...groupForm, name:e.target.value})} required/>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">O'qituvchi</label>
                  <select 
                    className={`w-full p-4 mt-1 rounded-2xl border outline-none font-bold appearance-none cursor-pointer focus:border-blue-500 transition-all ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} 
                    value={groupForm.teacher} 
                    onChange={e=>setGroupForm({...groupForm, teacher:e.target.value})}
                  >
                    {allTeachers.map((t, i) => <option key={i} value={t} className={isDark ? "text-slate-900" : ""}>{t}</option>)}
                    <option value="Yangi O'qituvchi">+ Yangi qo'shish (Yozing)</option>
                  </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 {/* 🔥 KUNLARI SELECT GA O'ZGARTIRILDI */}
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2">Kunlari</label>
                    <select 
                       className={`w-full p-4 mt-1 rounded-2xl border outline-none font-bold cursor-pointer focus:border-blue-500 transition-all ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} 
                       value={groupForm.days} 
                       onChange={e=>setGroupForm({...groupForm, days:e.target.value})} 
                       required
                    >
                       <option value="Dushanba">Dushanba</option>
                       <option value="Seshanba">Seshanba</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2">Vaqti</label>
                    <input className={`w-full p-4 mt-1 rounded-2xl border outline-none font-bold focus:border-blue-500 transition-all ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={groupForm.time} onChange={e=>setGroupForm({...groupForm, time:e.target.value})} required/>
                 </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">Narxi (UZS)</label>
                  <input type="number" className={`w-full p-4 mt-1 rounded-2xl border outline-none font-bold focus:border-blue-500 transition-all ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={groupForm.price} onChange={e=>setGroupForm({...groupForm, price:e.target.value})} required/>
               </div>

               <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 text-white rounded-2xl font-bold mt-2 flex items-center justify-center gap-2 active:scale-95 transition-all">
                 <Save size={20}/> Saqlash
               </button>
             </form>
          </div>
        </div>
      )}

      {/* --- O'QUVCHI QO'SHISH MODALI --- */}
      {addModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
           <div className={`w-full max-w-sm p-8 rounded-[32px] shadow-2xl ${isDark ? 'bg-[#161d31] border border-white/10' : 'bg-white'}`}>
             <h3 className={`font-black text-xl mb-4 ${isDark?'text-white':'text-slate-900'}`}>O'quvchi Qo'shish</h3>
             <form onSubmit={handleAdd} className="space-y-4">
               <input placeholder="Ism Familiya" className={`w-full p-4 rounded-2xl border outline-none font-bold focus:border-blue-500 transition-all ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={newSt.name} onChange={e=>setNewSt({...newSt, name:e.target.value})} required/>
               <input placeholder="Tel (+998...)" className={`w-full p-4 rounded-2xl border outline-none font-bold focus:border-blue-500 transition-all ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={newSt.phone} onChange={e=>setNewSt({...newSt, phone:e.target.value})} required/>
               <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all">Saqlash</button>
             </form>
             <button onClick={() => setAddModal(false)} className="w-full mt-4 text-slate-400 font-bold hover:text-slate-600 transition">Yopish</button>
           </div>
        </div>
      )}

      {/* --- TO'LOV MODALI --- */}
      {payModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
           <div className={`w-full max-w-sm p-8 rounded-[32px] shadow-2xl ${isDark ? 'bg-[#161d31] border border-white/10' : 'bg-white'}`}>
             <h3 className={`font-black text-xl mb-4 ${isDark?'text-white':'text-slate-900'}`}>To'lov qilish</h3>
             <form onSubmit={handlePay}>
               <input type="number" className={`w-full p-4 rounded-2xl border outline-none font-bold focus:border-emerald-500 transition-all text-center text-xl ${isDark ? 'bg-[#0b1120] border-white/5 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-600'}`} value={amount} onChange={e=>setAmount(e.target.value)} required />
               <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold mt-4 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all">Tasdiqlash</button>
             </form>
             <button onClick={() => setPayModal(false)} className="w-full mt-4 text-slate-400 font-bold hover:text-slate-600 transition">Yopish</button>
           </div>
        </div>
      )}

    </div>
  );
};