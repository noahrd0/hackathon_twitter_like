// src/pages/Signup/SignupPage.jsx
import React, { useState } from 'react';
import './SignUpPage.css';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    // Logique d'inscription (à implémenter, comme validation, appel API, etc.)
    console.log('SignUp:', email, pseudo, password);
  };

  return (
    <div className="signup-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pseudo">Pseudo</label>
          <input
            type="text"
            id="pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Choisissez un pseudo"
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
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}

export default SignupPage;
