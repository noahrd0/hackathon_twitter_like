import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
