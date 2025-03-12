import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Tab, Tabs, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Composant ProfilePage
const ProfilePage = () => {
  // États pour les informations de profil
  const [profile, setProfile] = useState({
    username: 'utilisateur_ipssi',
    displayName: 'Utilisateur IPSSI',
    bio: 'Étudiant passionné par le développement web et les nouvelles technologies. #IPSSI #Développement #React',
    location: 'Paris, France',
    website: 'www.monsite.fr',
    joinDate: 'Janvier 2023',
    following: 245,
    followers: 183,
    profileImage: '/api/placeholder/200/200',
    coverImage: '/api/placeholder/800/200',
  });

  // États pour la modification du profil
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState({...profile});
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageType, setImageType] = useState('profile'); // 'profile' ou 'cover'
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // État pour les messages flash
  const [flashMessage, setFlashMessage] = useState(null);
  
  // Référence pour l'input file
  const fileInputRef = useRef(null);

  // Styles personnalisés
  const profileStyles = `
    .profile-banner {
      position: relative;
      height: 200px;
      background-color: #192734;
      background-size: cover;
      background-position: center;
      border-bottom: 1px solid #38444d;
    }
    
    .profile-banner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      transition: background-color 0.2s;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
    }
    
    .profile-banner-overlay:hover {
      opacity: 1;
    }
    
    .profile-avatar-container {
      position: relative;
      margin-top: -75px;
      margin-left: 20px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid #15202b;
      background-color: #192734;
    }
    
    .profile-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .profile-avatar-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.2s;
      cursor: pointer;
    }
    
    .profile-avatar-container:hover .profile-avatar-overlay {
      opacity: 1;
    }
    
    .profile-header {
      padding: 10px 20px;
    }
    
    .profile-stats {
      display: flex;
      gap: 20px;
      margin-top: 10px;
      color: #8899a6;
    }
    
    .profile-stat-value {
      font-weight: bold;
      color: white;
    }
    
    .profile-bio {
      margin-top: 20px;
      margin-bottom: 20px;
      white-space: pre-line;
    }
    
    .profile-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      color: #8899a6;
      margin-bottom: 20px;
    }
    
    .profile-meta-item {
      display: flex;
      align-items: center;
    }
    
    .profile-meta-icon {
      margin-right: 5px;
    }
    
    .profile-tabs {
      border-bottom: 1px solid #38444d;
    }
    
    .profile-tabs .nav-link {
      color: #8899a6;
      border: none;
      padding: 15px 20px;
      border-radius: 0;
      font-weight: bold;
    }
    
    .profile-tabs .nav-link.active {
      color: #1DA1F2;
      background-color: transparent;
      border-bottom: 2px solid #1DA1F2;
    }
    
    .profile-tabs .nav-link:hover:not(.active) {
      background-color: rgba(29, 161, 242, 0.1);
      color: #1DA1F2;
    }
    
    .profile-edit-form-control {
      background-color: #192734;
      border: 1px solid #38444d;
      color: white;
      border-radius: 4px;
    }
    
    .profile-edit-form-control:focus {
      background-color: #192734;
      color: white;
      border-color: #1DA1F2;
      box-shadow: 0 0 0 0.25rem rgba(29, 161, 242, 0.25);
    }
    
    .char-count {
      text-align: right;
      color: #8899a6;
      font-size: 12px;
    }
    
    .profile-action-btn {
      border-radius: 30px;
      padding: 8px 16px;
      font-weight: bold;
    }
    
    .post-item {
      border-bottom: 1px solid #38444d;
      padding: 15px;
    }
    
    .post-item:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
    
    .flash-message {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      animation: fadeInOut 5s forwards;
    }
    
    @keyframes fadeInOut {
      0% { opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { opacity: 0; }
    }
    
    .modal-content {
      background-color: #15202b;
      color: white;
      border: 1px solid #38444d;
    }
    
    .modal-header {
      border-bottom: 1px solid #38444d;
    }
    
    .modal-footer {
      border-top: 1px solid #38444d;
    }
    
    .image-preview-container {
      width: 100%;
      max-height: 300px;
      overflow: hidden;
      margin-bottom: 15px;
      border-radius: 8px;
      border: 1px dashed #38444d;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .image-preview {
      max-width: 100%;
      max-height: 300px;
    }
    
    .upload-placeholder {
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      color: #8899a6;
    }
  `;

  // Fonction de sauvegarde du profil
  const handleSaveProfile = async () => {
    try {
      // Simulation d'appel API ici
      // const response = await fetch('http://localhost:5201/api/users/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(editProfile),
      // });
      
      // Mise à jour du profil (à remplacer par la réponse API réelle)
      setProfile(editProfile);
      setIsEditing(false);
      
      // Message flash de succès
      setFlashMessage({
        type: 'success',
        message: 'Profil mis à jour avec succès !'
      });
      
      // Disparition du message après 5 secondes
      setTimeout(() => {
        setFlashMessage(null);
      }, 5000);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setFlashMessage({
        type: 'danger',
        message: 'Erreur lors de la mise à jour du profil'
      });
    }
  };

  // Gestion du changement dans les champs de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({
      ...editProfile,
      [name]: value
    });
  };

  // Ouvrir le modal de modification d'image
  const handleOpenImageModal = (type) => {
    setImageType(type);
    setShowImageModal(true);
    setImagePreview(null);
    setNewImage(null);
  };

  // Gérer le changement d'image
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setNewImage(selectedImage);
      
      // Créer une URL pour la prévisualisation
      const previewUrl = URL.createObjectURL(selectedImage);
      setImagePreview(previewUrl);
    }
  };

  // Enregistrer la nouvelle image
  const handleSaveImage = async () => {
    if (!newImage) return;
    
    try {
      // Ici, vous enverriez généralement l'image au serveur
      // En utilisant FormData pour une requête multipart/form-data
      
      // const formData = new FormData();
      // formData.append('image', newImage);
      // formData.append('type', imageType);
      
      // const response = await fetch('http://localhost:5201/api/users/profile/image', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: formData,
      // });
      
      // Pour la démo, nous allons simplement utiliser l'URL de prévisualisation
      const updatedProfile = {...profile};
      if (imageType === 'profile') {
        updatedProfile.profileImage = imagePreview;
      } else {
        updatedProfile.coverImage = imagePreview;
      }
      
      setProfile(updatedProfile);
      setEditProfile(updatedProfile);
      setShowImageModal(false);
      
      // Message flash
      setFlashMessage({
        type: 'success',
        message: `Image ${imageType === 'profile' ? 'de profil' : 'de couverture'} mise à jour !`
      });
      
      setTimeout(() => {
        setFlashMessage(null);
      }, 5000);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image:', error);
      setFlashMessage({
        type: 'danger',
        message: 'Erreur lors de la mise à jour de l\'image'
      });
    }
  };

  // Simuler des publications pour l'onglet "Publications"
  const dummyPosts = [
    {
      id: 1,
      content: "Je suis ravi de partager mon dernier projet React avec la communauté IPSSI ! #ReactJS #IPSSI",
      date: "Il y a 2 heures",
      likes: 12,
      comments: 3,
      reposts: 2
    },
    {
      id: 2,
      content: "La dernière conférence sur le développement web était incroyable. J'ai appris tellement de nouvelles techniques !",
      date: "Il y a 1 jour",
      likes: 24,
      comments: 5,
      reposts: 7
    },
    {
      id: 3,
      content: "Qui serait intéressé par un atelier sur les API REST le mois prochain ? #Développement #API",
      date: "Il y a 3 jours",
      likes: 18,
      comments: 12,
      reposts: 4
    }
  ];

  return (
    <Container fluid className="p-0">
      <style>{profileStyles}</style>
      
      {/* Message flash */}
      {flashMessage && (
        <div className="flash-message">
          <Alert variant={flashMessage.type} onClose={() => setFlashMessage(null)} dismissible>
            {flashMessage.message}
          </Alert>
        </div>
      )}
      
      {/* Bannière de profil */}
      <div 
        className="profile-banner" 
        style={{ backgroundImage: `url(${profile.coverImage})` }}
      >
        <div 
          className="profile-banner-overlay"
          onClick={() => handleOpenImageModal('cover')}
        >
          <Button variant="dark" className="rounded-circle p-2">
            <i className="bi bi-camera-fill"></i>
          </Button>
        </div>
      </div>
      
      {/* Section d'informations de profil */}
      <Container>
        <Row className="mb-4">
          <Col>
            <div className="profile-avatar-container">
              <img 
                src={profile.profileImage} 
                alt="Photo de profil" 
                className="profile-avatar" 
              />
              <div 
                className="profile-avatar-overlay"
                onClick={() => handleOpenImageModal('profile')}
              >
                <Button variant="dark" className="rounded-circle p-2">
                  <i className="bi bi-camera-fill"></i>
                </Button>
              </div>
            </div>
            
            <div className="d-flex justify-content-end mt-3 mb-2">
              {!isEditing ? (
                <Button 
                  variant="outline-primary" 
                  className="profile-action-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Modifier le profil
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline-secondary" 
                    className="profile-action-btn me-2"
                    onClick={() => {
                      setIsEditing(false);
                      setEditProfile({...profile});
                    }}
                  >
                    Annuler
                  </Button>
                  <Button 
                    variant="primary" 
                    className="profile-action-btn"
                    onClick={handleSaveProfile}
                  >
                    Enregistrer
                  </Button>
                </>
              )}
            </div>
            
            <div className="profile-header">
              {!isEditing ? (
                <>
                  <h3 className="fw-bold mb-0">{profile.displayName}</h3>
                  <p className="text-muted">@{profile.username}</p>
                  
                  <div className="profile-bio">
                    {profile.bio}
                  </div>
                  
                  <div className="profile-meta">
                    {profile.location && (
                      <div className="profile-meta-item">
                        <i className="bi bi-geo-alt profile-meta-icon"></i>
                        {profile.location}
                      </div>
                    )}
                    {profile.website && (
                      <div className="profile-meta-item">
                        <i className="bi bi-link-45deg profile-meta-icon"></i>
                        <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-primary">
                          {profile.website}
                        </a>
                      </div>
                    )}
                    <div className="profile-meta-item">
                      <i className="bi bi-calendar3 profile-meta-icon"></i>
                      A rejoint en {profile.joinDate}
                    </div>
                  </div>
                  
                  <div className="profile-stats">
                    <div>
                      <span className="profile-stat-value">{profile.following}</span> abonnements
                    </div>
                    <div>
                      <span className="profile-stat-value">{profile.followers}</span> abonnés
                    </div>
                  </div>
                </>
              ) : (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom affiché</Form.Label>
                    <Form.Control
                      type="text"
                      name="displayName"
                      value={editProfile.displayName}
                      onChange={handleInputChange}
                      className="profile-edit-form-control"
                      maxLength={50}
                    />
                    <div className="char-count">
                      {editProfile.displayName.length}/50
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Nom d'utilisateur</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={editProfile.username}
                      onChange={handleInputChange}
                      className="profile-edit-form-control"
                      maxLength={15}
                    />
                    <div className="char-count">
                      {editProfile.username.length}/15
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="bio"
                      value={editProfile.bio}
                      onChange={handleInputChange}
                      className="profile-edit-form-control"
                      maxLength={160}
                    />
                    <div className="char-count">
                      {editProfile.bio.length}/160
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Localisation</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={editProfile.location}
                      onChange={handleInputChange}
                      className="profile-edit-form-control"
                      maxLength={30}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Site web</Form.Label>
                    <Form.Control
                      type="text"
                      name="website"
                      value={editProfile.website}
                      onChange={handleInputChange}
                      className="profile-edit-form-control"
                      maxLength={100}
                    />
                  </Form.Group>
                </Form>
              )}
            </div>
          </Col>
        </Row>
        
        {/* Onglets de profil */}
        <Tabs 
          defaultActiveKey="posts" 
          className="profile-tabs mb-3"
        >
          <Tab eventKey="posts" title="Publications">
            <div>
              {dummyPosts.map(post => (
                <div key={post.id} className="post-item">
                  <p>{post.content}</p>
                  <small className="text-muted">{post.date}</small>
                  <div className="d-flex gap-3 mt-2">
                    <div>
                      <i className="bi bi-heart"></i> {post.likes}
                    </div>
                    <div>
                      <i className="bi bi-chat"></i> {post.comments}
                    </div>
                    <div>
                      <i className="bi bi-arrow-repeat"></i> {post.reposts}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tab>
          
          <Tab eventKey="replies" title="Réponses">
            <div className="p-5 text-center text-muted">
              <p>Pas encore de réponses à afficher</p>
            </div>
          </Tab>
          
          <Tab eventKey="media" title="Médias">
            <div className="p-5 text-center text-muted">
              <p>Pas encore de médias à afficher</p>
            </div>
          </Tab>
          
          <Tab eventKey="likes" title="J'aime">
            <div className="p-5 text-center text-muted">
              <p>Pas encore de publications aimées à afficher</p>
            </div>
          </Tab>
        </Tabs>
      </Container>
      
      {/* Modal pour changer l'image */}
      <Modal 
        show={showImageModal} 
        onHide={() => setShowImageModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {imageType === 'profile' ? 'Modifier la photo de profil' : 'Modifier la photo de couverture'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="image-preview-container">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Prévisualisation" 
                className="image-preview" 
              />
            ) : (
              <div className="upload-placeholder">
                <i className="bi bi-cloud-arrow-up fs-1"></i>
                <p>Sélectionnez une image à télécharger</p>
                <Button 
                  variant="outline-primary"
                  onClick={() => fileInputRef.current.click()}
                >
                  Parcourir
                </Button>
              </div>
            )}
          </div>
          
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          
          {imagePreview && (
            <Button 
              variant="outline-secondary" 
              className="w-100"
              onClick={() => fileInputRef.current.click()}
            >
              Changer d'image
            </Button>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveImage}
            disabled={!newImage}
          >
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// N'oubliez pas d'ajouter un composant Alert pour les messages flash
const Alert = ({ variant, onClose, dismissible, children }) => {
  return (
    <div className={`alert alert-${variant} ${dismissible ? 'alert-dismissible' : ''}`} role="alert">
      {children}
      {dismissible && (
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
      )}
    </div>
  );
};

export default ProfilePage;