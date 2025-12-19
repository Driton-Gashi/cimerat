import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.tsx';
import Payments from './pages/payments/Payments.tsx';
import Header from './components/header/Header.tsx';
import Sidebar from './components/sidebar/Sidebar.tsx';
import CreatePayment from './pages/payments/CreatePayment.tsx';
import './app.css';

function App() {
   return (
      <BrowserRouter>
         <div className="app-layout">
            <Sidebar />
            <main className="main-content">
               <Header />
               <section className="main-content-inner">
                  <Routes>
                     <Route index element={<Home />} />
                     <Route path="/payments" element={<Payments />} />
                     <Route path="/payments/create" element={<CreatePayment />} />
                  </Routes>
               </section>
            </main>
         </div>
      </BrowserRouter>
   );
}

export default App;
