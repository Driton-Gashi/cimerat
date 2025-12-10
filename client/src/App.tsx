import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home.tsx'
import Pagesat from './pages/Pagesat/Pagesat.tsx'

function App() {

   return (
      <BrowserRouter>
         <>
         <header>
            <nav>
               <h1>Cimerat</h1>
               <NavLink to='/'>Home</NavLink>
               <NavLink to='pagesat'>Pagesat</NavLink>
            </nav>
         </header>
         <Routes>
            <Route index element={<Home />}></Route>
            <Route path='pagesat' element={<Pagesat />}></Route>
         </Routes>
         </>
      </BrowserRouter>
   );
}

export default App;
