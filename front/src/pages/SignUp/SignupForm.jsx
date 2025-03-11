// src/pages/SignUp/SignupForm.jsx
import React, { useState } from 'react';
import SignupButton from './SignupButton'; // Import du bouton de soumission

function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Fonction pour mettre à jour l'état du formulaire lors de la saisie
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Appeler une fonction pour soumettre au backend (cela viendra plus tard)
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <div>
        <label>Nom d'utilisateur</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Entrez votre nom d'utilisateur"
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Entrez votre email"
        />
      </div>
      <div>
        <label>Mot de passe</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Entrez votre mot de passe"
        />
      </div>
      <SignupButton /> {/* Bouton de soumission */}
    </form>
  );
}

export default SignupForm;
