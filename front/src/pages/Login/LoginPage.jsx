// src/pages/Login/LoginPage.jsx
import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Logique de connexion (à implémenter, comme validation, appel API, etc.)
    console.log('Login:', pseudo, password);
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="pseudo">Pseudo</label>
          <input
            type="text"
            id="pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Entrez votre pseudo"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default LoginPage;
