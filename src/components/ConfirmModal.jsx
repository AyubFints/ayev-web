import React from 'react';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDark }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-md p-6 rounded-[28px] shadow-2xl scale-100 animate-in zoom-in-95 duration-200 ${
          isDark 
            ? 'bg-[#1e293b] border border-white/10 text-white' 
            : 'bg-white text-slate-900'
        }`}
      >
        {/* Sarlavha */}
        <h3 className="text-xl font-bold mb-2">
          {title || "Tasdiqlash"}
        </h3>

        {/* Xabar */}
        <p className={`text-sm font-medium mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {message || "Haqiqatan ham buni bajarmoqchimisiz?"}
        </p>

        {/* Tugmalar */}
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className={`flex-1 py-3 rounded-xl font-bold transition active:scale-95 ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 text-slate-300' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Yo'q, qaytish
          </button>
          
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 transition active:scale-95"
          >
            Ha, bajarish
          </button>
        </div>
      </div>
    </div>
  );
};