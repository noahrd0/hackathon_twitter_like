import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    
    // Rediriger vers la page de connexion
    navigate('/login');
  };

  return (
    <Button 
      variant="outline-danger" 
      className="ms-2" 
      onClick={handleLogout}
    >
      <i className="bi bi-box-arrow-right me-1"></i>
      Déconnexion
    </Button>
  );
};

export default LogoutButton;