import React, { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Yordamchi funksiya: Bazadan o'qish
  const load = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch { return []; }
  };

  // 1. 🔥 LOGINNI ESLAB QOLISH (ENG MUHIM QISM)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('crm_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [students, setStudents] = useState(() => load('crm_students'));
  const [groups, setGroups] = useState(() => load('crm_groups'));
  const [payments, setPayments] = useState(() => load('crm_payments'));
  const [expenses, setExpenses] = useState(() => load('crm_expenses')); 
  // 🔥 YANGI: Davomat state'i
  const [attendance, setAttendance] = useState(() => load('crm_attendance')); 
  const [theme, setTheme] = useState(localStorage.getItem('crm_theme') || 'light');

  // 2. 🔥 O'ZGARISHLARNI SAQLASH (Effect)
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('crm_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('crm_user'); 
    }
    
    localStorage.setItem('crm_students', JSON.stringify(students));
    localStorage.setItem('crm_groups', JSON.stringify(groups));
    localStorage.setItem('crm_payments', JSON.stringify(payments));
    localStorage.setItem('crm_expenses', JSON.stringify(expenses));
    // 🔥 YANGI: Davomatni xotiraga yozish
    localStorage.setItem('crm_attendance', JSON.stringify(attendance)); 
    localStorage.setItem('crm_theme', theme);
  }, [currentUser, students, groups, payments, expenses, attendance, theme]);

  // LOGIN FUNKSIYASI
  const login = (u, p) => {
    const savedPass = localStorage.getItem('crm_custom_password');
    const correctPass = savedPass || 'ayew_edu_AX'; 

    if (u === 'ayewedu_AX' && p === correctPass) {
      const userObj = { username: 'Director', role: 'admin' };
      setCurrentUser(userObj);
      localStorage.setItem('crm_user', JSON.stringify(userObj)); 
      return { success: true };
    }
    return { success: false, message: 'Parol xato' };
  };

  // CHIQISH FUNKSIYASI
  const logout = () => { 
      setCurrentUser(null); 
      localStorage.removeItem('crm_user'); 
      window.location.reload(); 
  };

  // --- CRUD Funksiyalar ---
  const addStudent = (st) => setStudents(prev => [...prev, { ...st, id: Date.now() }]);
  const updateStudent = (st) => setStudents(prev => prev.map(s => s.id === st.id ? st : s));
  const deleteStudent = (id) => setStudents(prev => prev.filter(s => s.id !== id));
  
  const addGroup = (gr) => setGroups(prev => [...prev, { ...gr, id: Date.now() }]);
  const updateGroup = (updatedGroup) => {
    const oldGroup = groups.find(g => g.id === updatedGroup.id);
    setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
    if (oldGroup && oldGroup.name !== updatedGroup.name) {
       setStudents(prev => prev.map(s => s.group === oldGroup.name ? { ...s, group: updatedGroup.name } : s));
    }
  };
  const deleteGroup = (id) => setGroups(prev => prev.filter(g => g.id !== id));
  
  const addPayment = (pay) => setPayments(prev => [...prev, { ...pay, id: Date.now(), date: new Date().toLocaleDateString() }]);
  const addExpense = (exp) => setExpenses(prev => [...prev, { ...exp, id: Date.now(), date: new Date().toLocaleDateString() }]);
  const deleteExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  // 🔥 YANGI: Davomatni belgilash funksiyasi
  const markAttendance = (date, groupId, studentId, status) => {
    setAttendance(prev => {
      // Shu o'quvchi uchun shu kuni saqlangan oldingi davomatni topamiz
      const existingRecordIndex = prev.findIndex(a => 
        a.date === date && 
        a.groupId === groupId && 
        a.studentId === studentId
      );

      // Agar oldin saqlangan bo'lsa, statusini yangilaymiz
      if (existingRecordIndex !== -1) {
        const newAttendance = [...prev];
        newAttendance[existingRecordIndex].status = status;
        return newAttendance;
      }

      // Agar oldin saqlanmagan bo'lsa, yangi qo'shamiz
      return [...prev, { date, groupId, studentId, status }];
    });
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <DataContext.Provider value={{
      currentUser, 
      // 🔥 YANGI: attendance db obyektiga qo'shildi
      db: { students, groups, payments, expenses, attendance },
      login, logout, theme, toggleTheme,
      addStudent, updateStudent, deleteStudent,
      addGroup, updateGroup, deleteGroup, 
      addPayment, addExpense, deleteExpense,
      markAttendance // 🔥 YANGI: Funksiya ham export qilindi
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);