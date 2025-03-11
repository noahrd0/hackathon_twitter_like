import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log('Email:', email);
    console.log('Mot de passe:', password);
    try {
      const response = await fetch('http://localhost:5201/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Sauvegarder le token
        console.log('Token:', data.token);
        navigate('/'); // Rediriger vers la page d'accueil
      } else {
        setError(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Une erreur est survenue');
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Connexion</h2>

              {/* Affichage des erreurs */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Formulaire de connexion */}
              <form onSubmit={handleLogin}>
                {/* Champ Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Champ Mot de passe */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Bouton de soumission */}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Se connecter
                  </button>
                </div>
              </form>

              {/* Lien vers la page d'inscription */}
              <p className="text-center mt-3">
                Pas encore de compte ? <a href="/register">Inscrivez-vous</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;