// src/pages/SignUp/SignupPage.jsx
import React from 'react';
import SignupForm from './SignupForm'; // Import du formulaire

function SignupPage() {
  return (
    <div className="signup-page">
      <h1>Inscription</h1>
      <SignupForm /> {/* Inclusion du formulaire d'inscription */}
    </div>
  );
}

export default SignupPage;
