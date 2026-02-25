import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';

// --- SAHIFALAR ---
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Groups } from './pages/Groups';
import { GroupDetails } from './pages/GroupDetails';
import { Payments } from './pages/Payments';
import { Settings } from './pages/Settings';
// 🔥 MUHIM: Mana bu importni tekshiring. Agar pages papkasida Attendance.jsx bo'lsa, xuddi shunday yozilishi shart:
import { Attendance } from './pages/Attendance'; 

// --- KOMPONENTLAR ---
import { Sidebar } from './components/Sidebar';

const Layout = ({ children }) => {
  const { currentUser } = useData();
  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-[#0f172a]">
      <Sidebar />
      <main className="flex-1 md:ml-20 transition-all duration-300 p-4 md:p-8 w-full">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const LoginGuard = ({ children }) => {
  const { currentUser } = useData();
  if (currentUser) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <Router>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginGuard><Login /></LoginGuard>} />

          {/* HIMOYALANGAN YO'LLAR */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/students" element={<Layout><Students /></Layout>} />
          <Route path="/groups" element={<Layout><Groups /></Layout>} />
          <Route path="/groups/:id" element={<Layout><GroupDetails /></Layout>} />
          
          {/* 🔥 DAVOMAT YO'LI - ANIQ SHUNDAY BO'LISHI KERAK */}
          <Route path="/attendance" element={<Layout><Attendance /></Layout>} />

          <Route path="/payments" element={<Layout><Payments /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />

          {/* ERROR BO'LSA DASHBOARDGA QAYTARISH */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DataProvider>
    </Router>
  );
}