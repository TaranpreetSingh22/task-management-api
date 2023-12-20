import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import Home from './Pages/Home/Home';
import UserSignup from './Pages/UserSignup/UserSignup';
import UserLogin from './Pages/UserLogin/UserLogin';
import AdminLogin from './Pages/AdminLogin/AdminLogin';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/UserSignup' element={<UserSignup />} />
          <Route path='/UserLogin' element={<UserLogin />} />
          <Route path='/AdminLogin' element={<AdminLogin />} />
        </Routes>
        <Footer />
      </BrowserRouter>  
    </>
  );
}

export default App;
