import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import LoginForm from './components/LoginForm.tsx';
import RegisterForm from './components/RegisterForm.tsx';
import TweetList from './components/TweetList.tsx';
import TweetDetail from './components/TweetDetails.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/' element={<TweetList />} />
        <Route path='/tweet/:tweetId' element={<TweetDetail tweetId={useParams().tweetId} />} />
        <Route path='/register' element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;