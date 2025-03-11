import React, { useState } from 'react';
import SignupButton from './SignupButton'; // Import du bouton de soumission

function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);  // pour gérer l'état de soumission du formulaire
  const [error, setError] = useState(null); // Pour afficher les erreurs

  // Fonction pour mettre à jour l'état du formulaire lors de la saisie
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);  // On indique que la soumission est en cours
    setError(null);  // Réinitialiser l'erreur

    try {
      // Appel au backend via une requête POST
      const response = await fetch('https://votre-backend-api.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'inscription');
      }

      const data = await response.json();
      console.log('Utilisateur créé avec succès:', data);
      // Vous pouvez ensuite rediriger l'utilisateur ou afficher un message de succès
    } catch (error) {
      setError(error.message);  // Si une erreur se produit, on l'affiche
      console.error('Erreur lors de l\'inscription:', error);
    } finally {
      setIsSubmitting(false);  // Soumission terminée
    }
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
          required
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
          required
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
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}  {/* Affichage des erreurs */}
      
      <SignupButton disabled={isSubmitting} /> {/* Bouton de soumission */}
    </form>
  );
}

export default SignupForm;
