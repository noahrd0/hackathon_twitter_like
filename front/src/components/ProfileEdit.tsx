import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditProfileForm = () => {
  const navigate = useNavigate();
  
  // État pour stocker les données de l'utilisateur
  const [user, setUser] = useState({
    username: '',
    bio: '',
    profilePicture: '',
    bannerPicture: '',
  });

  // État pour gérer les messages d'erreur ou de succès
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effet pour récupérer les données de l'utilisateur au chargement du composant
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5201/api/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const userData = await response.json();

        // Mettre à jour l'état avec les données de l'utilisateur
        setUser({
          username: userData.username,
          bio: userData.bio || '',
          profilePicture: userData.profilePicture || '',
          bannerPicture: userData.bannerPicture || '',
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Gestion des changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5201/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
        // Redirect to profile page after 1.5 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      } else {
        setMessage({ type: 'danger', text: 'Erreur lors de la mise à jour du profil' });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setMessage({ type: 'danger', text: 'Erreur lors de la mise à jour du profil' });
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate('/profile');
  };

  if (loading) {
    return <Container className="mt-4">Chargement des données...</Container>;
  }

  return (
    <Container className="mt-4">
      <h2>Modifier le profil</h2>

      {/* Affichage des messages d'erreur ou de succès */}
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      {/* Formulaire de modification du profil */}
      <Form onSubmit={handleSubmit}>
        {/* Champ pour le nom d'utilisateur */}
        <Form.Group className="mb-3">
          <Form.Label>Nom d'utilisateur</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* Champ pour la bio */}
        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="bio"
            value={user.bio}
            onChange={handleInputChange}
          />
        </Form.Group>

        {/* Champ pour la photo de profil */}
        <Form.Group className="mb-3">
          <Form.Label>Photo de profil (URL)</Form.Label>
          <Form.Control
            type="text"
            name="profilePicture"
            value={user.profilePicture}
            onChange={handleInputChange}
          />
          {user.profilePicture && (
            <div className="mt-2">
              <img 
                src={user.profilePicture} 
                alt="Aperçu de la photo de profil" 
                className="img-thumbnail" 
                style={{maxHeight: '100px'}} 
              />
            </div>
          )}
        </Form.Group>

        {/* Champ pour la bannière de profil */}
        <Form.Group className="mb-3">
          <Form.Label>Bannière de profil (URL)</Form.Label>
          <Form.Control
            type="text"
            name="bannerPicture"
            value={user.bannerPicture}
            onChange={handleInputChange}
          />
          {user.bannerPicture && (
            <div className="mt-2">
              <img 
                src={user.bannerPicture} 
                alt="Aperçu de la bannière" 
                className="img-thumbnail" 
                style={{maxHeight: '100px', width: '100%', objectFit: 'cover'}} 
              />
            </div>
          )}
        </Form.Group>

        <div className="d-flex gap-2">
          {/* Bouton d'annulation */}
          <Button variant="outline-secondary" onClick={handleCancel}>
            Annuler
          </Button>
          
          {/* Bouton de soumission */}
          <Button variant="primary" type="submit">
            Enregistrer les modifications
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditProfileForm;