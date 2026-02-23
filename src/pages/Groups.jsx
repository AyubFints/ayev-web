import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  Layers, Plus, X, Users, 
  Clock, Calendar, ChevronRight, Percent, Search 
} from 'lucide-react';

export const Groups = () => {
  const navigate = useNavigate();
  const data = useData();
  
  if (!data) return null;

  const { db, addGroup, theme } = data;
  const isDark = theme === 'dark';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '', teacher: '', price: '', days: '', time: '', teacherPercent: ''
  });

  const safeGroups = db?.groups || [];
  const safeStudents = db?.students || [];

  const filteredGroups = safeGroups.filter(group => 
    (group.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (group.teacher || '').toLowerCase().includes(search.toLowerCase())
  );

  const getGroupStats = (groupId) => {
    const groupName = safeGroups.find(g => g.id === groupId)?.name;
    const count = safeStudents.filter(s => s.group === groupName).length;
    return { count };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return alert("Nom majburiy!");
    addGroup(formData);
    setIsModalOpen(false);
    setFormData({ name: '', teacher: '', price: '', days: '', time: '', teacherPercent: '' });
  };

  return (
    <div className={`p-4 md:p-10 min-h-screen pb-24 transition-all duration-300 animate-in fade-in ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            Guruhlar <span className="text-sm font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">{safeGroups.length} ta</span>
          </h1>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Barcha yo'nalishlar
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
           <div className={`relative flex items-center px-4 py-3 rounded-2xl border w-full md:w-64 transition-all focus-within:ring-2 focus-within:ring-cyan-500/20 ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white border-slate-200'}`}>
              <Search size={20} className="text-slate-400 mr-2"/>
              <input 
                placeholder="Qidirish..." 
                className={`bg-transparent outline-none w-full font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-cyan-500/30 px-6 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2 text-white shadow-lg active:scale-95 whitespace-nowrap">
              <Plus size={20} /> Yangi Guruh
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGroups.length > 0 ? filteredGroups.map((group) => {
          const stats = getGroupStats(group.id);

          return (
            <div 
              key={group.id} 
              // --- 🔥 MANA SHU YER O'ZGARTIRILDI (Navigatsiya yoqildi) ---
              onClick={() => navigate(`/groups/${group.id}`)}
              className={`group relative p-6 rounded-[32px] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer overflow-hidden ${isDark ? 'bg-[#161d31] border-white/5 shadow-black/50 hover:border-cyan-500/30' : 'bg-white border-slate-200 shadow-slate-200 hover:border-cyan-200'}`}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-110"></div>

              <div className="flex items-start gap-4 mb-5 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isDark ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-400' : 'bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-600'}`}>
                  <Layers size={28} />
                </div>
                <div className="flex-1 min-w-0">
                   <h3 className="text-xl font-bold leading-tight mb-1 truncate pr-2">{group.name}</h3>
                   <div className="flex items-center gap-2">
                     <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>ID: {group.id}</span>
                   </div>
                </div>
              </div>

              <div className={`p-3 rounded-2xl mb-5 flex items-center gap-3 transition-colors ${isDark ? 'bg-black/20 group-hover:bg-black/30' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
                 <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {group.teacher ? group.teacher.charAt(0).toUpperCase() : "T"}
                 </div>
                 <div className="min-w-0">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">O'qituvchi</p>
                    <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{group.teacher || "Belgilanmagan"}</p>
                 </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${isDark ? 'bg-[#0b1120] border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <Calendar size={14} className="text-purple-500"/> {group.days || "Kunlar"}
                </span>
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${isDark ? 'bg-[#0b1120] border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <Clock size={14} className="text-orange-500"/> {group.time || "Vaqt"}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed border-slate-500/20 relative z-10">
                 <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">O'quvchilar</p>
                    <div className="flex items-center gap-2">
                       <Users size={16} className="text-blue-500"/>
                       <span className="text-lg font-black">{stats.count}</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Kurs Narxi</p>
                    <p className="font-black text-lg text-emerald-500 tracking-tight">
                      {Number(group.price).toLocaleString()}
                    </p>
                 </div>
              </div>

              <div className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0`}>
                 <div className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/40">
                    <ChevronRight size={20}/>
                 </div>
              </div>

            </div>
          )
        }) : (
          <div className="col-span-full py-20 text-center text-slate-500 opacity-50 flex flex-col items-center">
             <Layers size={80} className="mb-4 text-slate-300"/>
             <p className="text-2xl font-bold">Guruhlar topilmadi</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
           <div className={`w-full max-w-lg p-8 rounded-[32px] border shadow-2xl scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Yangi Guruh</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition"><X /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Guruh Nomi</label>
                    <input placeholder="Masalan: Frontend Foundation" className={`w-full p-4 rounded-2xl outline-none border transition-all focus:border-cyan-500 ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required />
                 </div>
                 
                 <div className="flex gap-4">
                   <div className="w-2/3 space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">O'qituvchi</label>
                      <input placeholder="Ism Familiya" className={`w-full p-4 rounded-2xl outline-none border transition-all focus:border-cyan-500 ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.teacher} onChange={e=>setFormData({...formData, teacher: e.target.value})} />
                   </div>
                   <div className="w-1/3 space-y-1 relative">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ulush (%)</label>
                      <input type="number" placeholder="50" className={`w-full p-4 rounded-2xl outline-none border font-bold text-center transition-all focus:border-emerald-500 ${isDark ? 'bg-[#0b1120] border-white/5 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-600'}`} value={formData.teacherPercent} onChange={e=>setFormData({...formData, teacherPercent: e.target.value})} />
                   </div>
                 </div>
                 
                 <div className="flex gap-4">
                    <div className="w-1/2 space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase ml-1">Narx (UZS)</label>
                       <input type="number" placeholder="1 000 000" className={`w-full p-4 rounded-2xl outline-none border transition-all focus:border-cyan-500 ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} required />
                    </div>
                    <div className="w-1/2 space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase ml-1">Vaqt</label>
                       <input placeholder="14:00" className={`w-full p-4 rounded-2xl outline-none border transition-all focus:border-cyan-500 ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.time} onChange={e=>setFormData({...formData, time: e.target.value})} />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Kunlar</label>
                    <input placeholder="Dush / Chor / Juma" className={`w-full p-4 rounded-2xl outline-none border transition-all focus:border-cyan-500 ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.days} onChange={e=>setFormData({...formData, days: e.target.value})} />
                 </div>

                 <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-500/10 rounded-2xl font-bold hover:bg-slate-500/20 text-slate-500 transition">Bekor</button>
                    <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-bold hover:shadow-lg text-white shadow-cyan-500/20 transition transform active:scale-95">Qo'shish</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};