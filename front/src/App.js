// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import NotificationsPage from './pages/Notifications/NotificationsPage'; // Import de la page Notifications
import ProfilePage from './pages/Profile/ProfilePage'; // Import de la page Profil
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
            <Link to="/login">
              <button className="login-button">Connexion</button>
            </Link>
            <Link to="/signup">
              <button className="signup-button">S'inscrire</button>
            </Link>
          </div>
        </header>
        <main className="app-content">
          <nav className="main-nav">
            <ul>
              <li className="active">
                <Link to="/" className="nav-link"><i className="fa fa-home"></i> Accueil</Link>
              </li>
              <li>
                {/* Lien vers Notifications */}
                <Link to="/notifications" className="nav-link"><i className="fa fa-bell"></i> Notifications</Link>
              </li>
              <li><i className="fa fa-bookmark"></i> Signets</li>
              <li>
                {/* Lien vers Profil */}
                <Link to="/profile" className="nav-link"><i className="fa fa-user"></i> Profil</Link>
              </li>
            </ul>
          </nav>
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              {/* Route pour la page Notifications */}
              <Route path="/notifications" element={<NotificationsPage />} />
              {/* Route pour la page Profil */}
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
