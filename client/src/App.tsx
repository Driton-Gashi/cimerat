import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import Pagesat from './pages/Pagesat/Pagesat.tsx';
import MyIcon from './components/icons/MyIcon.tsx';
import Header from './components/header/Header.tsx';

function App() {
   return (
      <BrowserRouter>
         <>
            <Header>
               <nav>
                  <h1>Cimerat test</h1>
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="pagesat">Pagesat</NavLink>
                  <NavLink to="#">
                     <MyIcon iconName="dashboard" />
                  </NavLink>
               </nav>
            </Header>

            <Routes>
               <Route index element={<Home />}></Route>
               <Route path="pagesat" element={<Pagesat />}></Route>
            </Routes>
         </>
      </BrowserRouter>
   );
}

export default App;
