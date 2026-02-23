import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';

// --- SAHIFALAR (PAGES) ---
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Groups } from './pages/Groups';
import { GroupDetails } from './pages/GroupDetails'; // ⚠️ Fayl borligini tekshiring
import { Payments } from './pages/Payments';
import { Settings } from './pages/Settings';

// --- KOMPONENTLAR ---
import { Sidebar } from './components/Sidebar';

// --- 1. LAYOUT (HIMOYALANGAN QOBIQ) ---
// Bu komponent faqat Login qilganlar uchun.
// Agar user kirmagan bo'lsa, Login sahifasiga haydaydi.
const Layout = ({ children }) => {
  const { currentUser } = useData();

  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-[#0f172a]">
      {/* Chap tomon - Sidebar */}
      <Sidebar />

      {/* O'ng tomon - Asosiy Kontent */}
      <main className="flex-1 md:ml-20 transition-all duration-300 p-4 md:p-8 w-full">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- 2. 🔥 YANGI: LOGIN GUARD (TESKARI HIMOYA) ---
// Bu komponent faqat Login qilMAGANLAR uchun.
// Agar user allaqachon tizimda bo'lsa, unga Login oynasini ko'rsatma, Dashboardga otib yubor.
const LoginGuard = ({ children }) => {
  const { currentUser } = useData();

  if (currentUser) return <Navigate to="/dashboard" replace />;

  return children;
};

// --- ASOSIY DASTUR ---
export default function App() {
  return (
    <Router>
      <DataProvider>
        <Routes>
          
          {/* 1. BO'SH JOY (ROOT) -> DASHBOARDGA YO'NALTIRISH
             Bu yerda mantiq shunday: 
             Biz uni "/dashboard" ga yuboramiz. 
             - Agar user kirgan bo'lsa, "Layout" uni o'tkazib yuboradi.
             - Agar user kirmagan bo'lsa, "Layout" uni baribir "/login" ga haydaydi.
          */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 2. KIRISH SAHIFASI (LoginGuard bilan o'ralgan) 
             Endi login qilgan odam bu sahifaga kirolmaydi (avtomatik dashboardga ketadi)
          */}
          <Route path="/login" element={
            <LoginGuard>
              <Login />
            </LoginGuard>
          } />

          {/* 3. HIMOYALANGAN SAHIFALAR (Layout ichida) */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/students" element={<Layout><Students /></Layout>} />
          
          {/* Guruhlar */}
          <Route path="/groups" element={<Layout><Groups /></Layout>} />
          <Route path="/groups/:id" element={<Layout><GroupDetails /></Layout>} />

          {/* Moliya va Sozlamalar */}
          <Route path="/payments" element={<Layout><Payments /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />

          {/* 4. NOTO'G'RI MANZIL -> DASHBOARDGA OTISH (Xavfsizroq) */}
          {/* Login ga emas, Dashboardga otgan yaxshi, chunki Layout o'zi tekshirib oladi */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </DataProvider>
    </Router>
  );
}