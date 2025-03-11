  // src/App.js
  import React from 'react';
  import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
  import HomePage from './pages/Home/HomePage';
  import LoginPage from './pages/Login/LoginPage';
  import SignUpPage from './pages/SignUp/SignUpPage';
  import './App.css';
  import { Link } from 'react-router-dom'; // Importer Link

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
              {/* Lien vers la page de connexion */}
              <Link to="/login">
                <img src="https://via.placeholder.com/40" alt="User" />
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
              {/* Utilisation de Routes pour la navigation */}
              <Routes>
                <Route path="/" element={<HomePage />} />
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
