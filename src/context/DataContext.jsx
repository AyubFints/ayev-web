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
      // Dastur ochilganda darhol tekshiradi: "Oldin kirganmidi?"
      const savedUser = localStorage.getItem('crm_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [students, setStudents] = useState(() => load('crm_students'));
  const [groups, setGroups] = useState(() => load('crm_groups'));
  const [payments, setPayments] = useState(() => load('crm_payments'));
  const [expenses, setExpenses] = useState(() => load('crm_expenses')); // Chiqimlar
  const [theme, setTheme] = useState(localStorage.getItem('crm_theme') || 'light');

  // 2. 🔥 O'ZGARISHLARNI SAQLASH (Effect)
  useEffect(() => {
    // Agar user bo'lsa saqlaymiz, bo'lmasa (null) o'chirib tashlamaymiz, shunchaki yangilaymiz
    if (currentUser) {
      localStorage.setItem('crm_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('crm_user'); // Chiqib ketganda o'chiramiz
    }
    
    localStorage.setItem('crm_students', JSON.stringify(students));
    localStorage.setItem('crm_groups', JSON.stringify(groups));
    localStorage.setItem('crm_payments', JSON.stringify(payments));
    localStorage.setItem('crm_expenses', JSON.stringify(expenses));
    localStorage.setItem('crm_theme', theme);
  }, [currentUser, students, groups, payments, expenses, theme]);

  // LOGIN FUNKSIYASI
  const login = (u, p) => {
    // Parolni localStorage dan olamiz (Settingsda o'zgartirilgan bo'lsa)
    const savedPass = localStorage.getItem('crm_custom_password');
    const correctPass = savedPass || 'ayew_edu_AX'; // Standart parol

    if (u === 'ayewedu_AX' && p === correctPass) {
      const userObj = { username: 'Director', role: 'admin' };
      setCurrentUser(userObj);
      localStorage.setItem('crm_user', JSON.stringify(userObj)); // 🔥 Darhol saqlash
      return { success: true };
    }
    return { success: false, message: 'Parol xato' };
  };

  // CHIQISH FUNKSIYASI
  const logout = () => { 
      setCurrentUser(null); 
      localStorage.removeItem('crm_user'); // 🔥 Xotiradan o'chirish
      window.location.reload(); 
  };

  // --- CRUD Funksiyalar (o'zgarishsiz) ---
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

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <DataContext.Provider value={{
      currentUser, 
      db: { students, groups, payments, expenses },
      login, logout, theme, toggleTheme,
      addStudent, updateStudent, deleteStudent,
      addGroup, updateGroup, deleteGroup, 
      addPayment, addExpense, deleteExpense
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);