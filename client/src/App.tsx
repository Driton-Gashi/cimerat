import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import Payments from './pages/Payments/Payments.tsx';
import Header from './components/header/Header.tsx';
import Sidebar from './components/sidebar/Sidebar.tsx';
import './app.css';

function App() {
   return (
      <BrowserRouter>
         <div className="app-layout">
            <Sidebar />
            <main className="main-content">
               <Header />
               <div>
                  <Routes>
                     <Route index element={<Home />} />
                     <Route path="/payments" element={<Payments />} />
                  </Routes>
               </div>
            </main>
         </div>
      </BrowserRouter>
   );
}

export default App;
