// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="logo">IPSSI</div>
          <div className="search-bar">
            <input type="text" placeholder="Rechercher sur Tweeter" />
          </div>
          <div className="user-menu">
            <img src="https://via.placeholder.com/40" alt="User" />
            {/* Le lien vers la page d'inscription */}
            <Link to="/signup">
              <button className="signup-button">
                S'inscrire
              </button>
            </Link>
          </div>
        </header>
        <main className="app-content">
          <nav className="main-nav">
            <ul>
              <li className="active"><i className="fa fa-home"></i> Accueil</li>
              <li><i className="fa fa-bell"></i> Notifications</li>
              <li><i className="fa fa-envelope"></i> Messages</li>
              <li><i className="fa fa-bookmark"></i> Signets</li>
              <li><i className="fa fa-user"></i> Profil</li>
            </ul>
          </nav>
          <div className="main-content">
            <Routes>
              {/* Page d'accueil */}
              <Route path="/" element={<HomePage />} />
              {/* Page de connexion */}
              <Route path="/login" element={<LoginPage />} />
              {/* Page d'inscription */}
              <Route path="/signup" element={<SignUpPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
