import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.tsx';
import Payments from './pages/payments/Payments.tsx';
import Header from './components/header/Header.tsx';
import Sidebar from './components/sidebar/Sidebar.tsx';
import CreatePayment from './pages/payments/create/CreatePayment.tsx';
import PaymentPage from './pages/payments/single/PaymentPage.tsx';
import './app.css';

function App() {
   const [isSidebarClosed, setIsSidebarClosed] = useState<boolean>(false);
   return (
      <BrowserRouter>
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
                  </Routes>
               </section>
            </main>
         </div>
      </BrowserRouter>
   );
}

export default App;
