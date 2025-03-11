// src/pages/SignUp/SignupButton.jsx
import React from 'react';

function SignupButton() {
  // Fonction pour gérer la soumission du formulaire via le bouton
  const handleClick = () => {
    // Vous pouvez ajouter l'appel API ici pour envoyer les données au backend
    alert('Form submitted!');
  };

  return (
    <button type="submit" onClick={handleClick} className="signup-button">
      S'inscrire
    </button>
  );
}

export default SignupButton;
