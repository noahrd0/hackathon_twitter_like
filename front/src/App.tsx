import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm.tsx';
import RegisterForm from './components/RegisterForm.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
