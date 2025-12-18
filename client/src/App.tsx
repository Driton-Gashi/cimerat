import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import Pagesat from './pages/Pagesat/Pagesat.tsx';
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
                     <Route path="pagesat" element={<Pagesat />} />
                  </Routes>
               </div>
            </main>
         </div>
      </BrowserRouter>
   );
}

export default App;
