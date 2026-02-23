import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  UserPlus, Phone, Calendar, Trash2, CheckCircle, X, 
  MessageCircle, Search, User, Layers 
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const Leads = () => {
  const data = useData();
  
  if (!data) return null;

  // groups ni ham olamiz
  const { leads, groups, addLead, deleteLead, addStudent, theme } = data;
  const isDark = theme === 'dark';
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [convertId, setConvertId] = useState(null);

  // 🔥 groupId qo'shildi
  const [formData, setFormData] = useState({ name: '', phone: '', source: 'Telegram', groupId: '' });
  const [search, setSearch] = useState('');

  const safeLeads = leads || [];
  const safeGroups = groups || [];

  // Qidiruv
  const filteredLeads = safeLeads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.phone.includes(search)
  );

  // --- ACTIONS ---

  const handleSubmit = (e) => {
    e.preventDefault();
    addLead(formData);
    setIsModalOpen(false);
    // Formani tozalash
    setFormData({ name: '', phone: '', source: 'Telegram', groupId: '' });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteLead(deleteId);
      setDeleteId(null);
    }
  };

  // 🔥 LIDNI O'QUVCHIGA AYLANTIRISH (Guruh bilan birga)
  const handleConvert = () => {
    if (convertId) {
      const lead = safeLeads.find(l => l.id === convertId);
      if (lead) {
        addStudent({
          name: lead.name,
          phone: lead.phone,
          // Agar lid guruh tanlagan bo'lsa, o'quvchini o'sha guruhga qo'shamiz
          groupIds: lead.groupId ? [parseInt(lead.groupId)] : [] 
        });
        deleteLead(lead.id); // Liddan o'chiramiz
      }
      setConvertId(null);
    }
  };

  return (
    <div className={`p-10 min-h-screen pb-24 transition-all duration-300 ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            Lidlar <span className="text-sm font-bold px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">{safeLeads.length} ta</span>
          </h1>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Qiziquvchilar ro'yxati va ularni boshqarish
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
           {/* Qidiruv */}
           <div className={`flex items-center px-4 py-3 rounded-2xl border w-full md:w-64 ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white border-slate-200'}`}>
              <Search size={20} className="text-slate-400 mr-2"/>
              <input 
                placeholder="Qidirish..." 
                className="bg-transparent outline-none w-full font-medium"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>

           <button 
             onClick={() => setIsModalOpen(true)} 
             className="bg-gradient-to-r from-orange-500 to-rose-500 hover:shadow-orange-500/30 px-6 py-3 rounded-2xl font-bold transition flex items-center gap-2 text-white shadow-lg active:scale-95 whitespace-nowrap"
           >
             <UserPlus size={20}/> Qo'shish
           </button>
        </div>
      </div>

      {/* LIDLAR RO'YXATI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.length > 0 ? filteredLeads.map((lead) => {
          // Guruh nomini topish
          const interestedGroup = safeGroups.find(g => g.id == lead.groupId);

          return (
            <div key={lead.id} className={`p-6 rounded-[32px] border relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${isDark ? 'bg-[#161d31] border-white/5 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200'}`}>
               
               {/* Header */}
               <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-600'}`}>
                    <User size={24}/>
                  </div>
                  <button 
                    onClick={() => setDeleteId(lead.id)} 
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition"
                  >
                    <Trash2 size={18}/>
                  </button>
               </div>

               {/* Info */}
               <h3 className="text-xl font-bold mb-1 truncate">{lead.name}</h3>
               <p className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                 <Phone size={14} className="text-cyan-500"/> {lead.phone}
               </p>

               {/* Source & Date & Group */}
               <div className="flex flex-wrap gap-2 mt-4 mb-6">
                  {/* Manba */}
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${isDark ? 'bg-[#0b1120] border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    <MessageCircle size={12} className="text-blue-500"/> {lead.source}
                  </span>
                  
                  {/* Sana */}
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${isDark ? 'bg-[#0b1120] border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    <Calendar size={12} className="text-slate-400"/> {lead.date}
                  </span>

                  {/* 🔥 Qiziqqan guruhi */}
                  {interestedGroup && (
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-600'}`}>
                      <Layers size={12}/> {interestedGroup.name}
                    </span>
                  )}
               </div>
               
               {/* Action Button */}
               <button 
                 onClick={() => setConvertId(lead.id)} 
                 className="w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold hover:bg-emerald-500 hover:text-white transition flex items-center justify-center gap-2 active:scale-95"
               >
                 <CheckCircle size={18}/> Qabul qilish
               </button>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center text-slate-500 opacity-50 flex flex-col items-center">
            <UserPlus size={64} className="mb-4 text-slate-300"/>
            <p className="text-xl font-bold">Lidlar topilmadi</p>
          </div>
        )}
      </div>

      {/* QO'SHISH MODALI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
           <div className={`w-full max-w-md p-8 rounded-[32px] border shadow-2xl scale-100 animate-in zoom-in-95 duration-200 ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Yangi Lid</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition"><X /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ism Familiya</label>
                    <input placeholder="Ism" className={`w-full p-4 rounded-2xl outline-none border transition-all focus:border-orange-500 ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required />
                 </div>
                 
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Telefon</label>
                    <input placeholder="+998" className={`w-full p-4 rounded-2xl outline-none border transition-all focus:border-orange-500 ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} required />
                 </div>

                 {/* 🔥 QAYSI GURUHGA QIZIQYAPTI? */}
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Qiziqayotgan Kursi</label>
                    <select 
                      className={`w-full p-4 rounded-2xl outline-none border transition-all focus:border-orange-500 ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} 
                      value={formData.groupId} 
                      onChange={e=>setFormData({...formData, groupId: e.target.value})}
                    >
                       <option value="" className="text-slate-500">Tanlanmagan</option>
                       {safeGroups.map(g => (
                         <option key={g.id} value={g.id}>{g.name}</option>
                       ))}
                    </select>
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Manba</label>
                    <select className={`w-full p-4 rounded-2xl outline-none border transition-all focus:border-orange-500 ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.source} onChange={e=>setFormData({...formData, source: e.target.value})}>
                       <option value="Telegram">Telegram</option>
                       <option value="Instagram">Instagram</option>
                       <option value="Facebook">Facebook</option>
                       <option value="Tanish">Tanish</option>
                       <option value="Boshqa">Boshqa</option>
                    </select>
                 </div>

                 <div className="flex gap-3 mt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-500/10 rounded-2xl font-bold hover:bg-slate-500/20 text-slate-500 transition">Bekor</button>
                    <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 transition transform active:scale-95">Saqlash</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* O'CHIRISHNI TASDIQLASH */}
      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        isDark={isDark} 
        title="Lidni o'chirish" 
        message="Haqiqatan ham bu lidni o'chirmoqchimisiz?" 
      />

      {/* QABUL QILISHNI TASDIQLASH */}
      <ConfirmModal 
        isOpen={!!convertId} 
        onClose={() => setConvertId(null)} 
        onConfirm={handleConvert} 
        isDark={isDark} 
        title="O'quvchiga aylantirish" 
        message={`Bu lidni o'quvchilar safiga qo'shmoqchimisiz? ${safeLeads.find(l=>l.id===convertId)?.groupId ? "U avtomatik tanlangan guruhga qo'shiladi." : ""}`} 
      />

    </div>
  );
};