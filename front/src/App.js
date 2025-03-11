// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Mise à jour pour v6
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
              <Route path="/" element={<HomePage />} />  {/* Utilisation de `element` */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
