import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/home/Home.tsx';
import Payments from './pages/payments/Payments.tsx';
import Header from './components/header/Header.tsx';
import Sidebar from './components/sidebar/Sidebar.tsx';
import CreatePayment from './pages/payments/create/CreatePayment.tsx';
import PaymentPage from './pages/payments/single/PaymentPage.tsx';
import ComplaintsPage from './pages/complaints/single/ComplaintsPage.tsx';
import Complaints from './pages/complaints/Complaints.tsx';
import CreateComplaint from './pages/complaints/create/CreateComplaint.tsx';
import Loans from './pages/loans/Loans.tsx';
import CreateLoan from './pages/loans/create/CreateLoan.tsx';
import Login from './pages/auth/Login.tsx';
import Signup from './pages/auth/Signup.tsx';
import Onboarding from './pages/auth/Onboarding.tsx';
import Join from './pages/auth/Join.tsx';
import AdminRoute from './components/auth/AdminRoute.tsx';
import Settings from './pages/settings/Settings.tsx';
import './app.css';

function AppLayout({
   isSidebarClosed,
   setIsSidebarClosed,
}: {
   isSidebarClosed: boolean;
   setIsSidebarClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
   return (
      <div className="app-layout">
         <Sidebar isClosed={isSidebarClosed} />
         <main className="main-content">
            <Header setIsSidebarClosed={setIsSidebarClosed} />
            <section className="main-content-inner">
               <Routes>
                  <Route path="/" index element={<Home />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/payments/create" element={<CreatePayment />} />
                  <Route path="/payments/:id" element={<PaymentPage />} />
                  <Route path="/complaints" element={<Complaints />} />
                  <Route path="/complaints/create" element={<CreateComplaint />} />
                  <Route path="/complaints/:id" element={<ComplaintsPage />} />
                  <Route path="/loans" element={<Loans />} />
                  <Route path="/loans/create" element={<CreateLoan />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/admin" element={<AdminRoute />} />
               </Routes>
            </section>
         </main>
      </div>
   );
}

function App() {
   const [isSidebarClosed, setIsSidebarClosed] = useState<boolean>(false);

   return (
      <BrowserRouter>
         <AuthProvider>
            <Routes>
               <Route path="/login" element={<Login />} />
               <Route path="/signup" element={<Signup />} />
               <Route path="/join" element={<Join />} />
               <Route
                  path="/onboarding"
                  element={
                     <ProtectedRoute requireApartment={false}>
                        <Onboarding />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/*"
                  element={
                     <ProtectedRoute>
                        <AppLayout
                           isSidebarClosed={isSidebarClosed}
                           setIsSidebarClosed={setIsSidebarClosed}
                        />
                     </ProtectedRoute>
                  }
               />
               <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
         </AuthProvider>
      </BrowserRouter>
   );
}

export default App;
