import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tweet from './tweets/Tweet'; // Import the Tweet component

const TwitterLikeProfile = () => {
  const navigate = useNavigate();
  
  // État pour stocker les données de l'utilisateur
  const [user, setUser] = useState({
    username: '',
    bio: '',
    profilePicture: '',
    bannerPicture: '',
    followers: [],
    following: [],
  });

  // État pour stocker les tweets de l'utilisateur
  const [userTweets, setUserTweets] = useState([]);

  const [userId, setUserId] = useState(null);
  
  // État pour gérer le chargement
  const [loading, setLoading] = useState(true);
  const [tweetsLoading, setTweetsLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    const getUserIdFromToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5201/api/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const userData = await response.json();
        console.log(userData);

        // Mettre à jour l'état avec les données de l'utilisateur
        setUser({
          username: userData.username,
          bio: userData.bio,
          profilePicture: userData.profilePicture,
          bannerPicture: userData.bannerPicture,
          followers: userData.followers,
          following: userData.following,
        });

        setLoading(false); // Fin du chargement
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setLoading(false); // Fin du chargement même en cas d'erreur
      }
    };

    getUserIdFromToken();
    fetchUserData();
  }, []);

  // Fetch user tweets
  useEffect(() => {
    const fetchUserTweets = async () => {
      console.log('Fetching user tweets...');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5201/api/tweets/getuserprofile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const tweetsData = await response.json();
          console.log('User tweets:', tweetsData);
          setUserTweets(tweetsData);
        } else {
          console.error('Erreur lors de la récupération des tweets');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des tweets:', error);
      } finally {
        setTweetsLoading(false);
      }
    };

    fetchUserTweets();
  }, []);

  // Function to handle navigation to edit profile page
  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  // Function to refresh tweets after actions (like, retweet, etc.)
  const refreshTweets = async () => {
    setTweetsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5201/api/tweets/getuserprofile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const tweetsData = await response.json();
        setUserTweets(tweetsData);
      }
    } catch (error) {
      console.error('Erreur lors de l\'actualisation des tweets:', error);
    } finally {
      setTweetsLoading(false);
    }
  };

  // Si les données sont en cours de chargement
  if (loading) {
    return <div className="text-center mt-5">Chargement du profil...</div>;
  }

  return (
    <Container fluid className="p-0">
      {/* Bannière de profil */}
      <div
        style={{
          backgroundImage: `url(${user.bannerPicture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '200px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        ></div>
      </div>

      {/* Section d'informations de profil */}
      <Container>
        <Row className="mt-4">
          <Col>
            {/* Photo de profil */}
            <div
              style={{
                marginTop: '-75px',
                marginLeft: '20px',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid white',
                position: 'relative',
              }}
            >
              <img
                src={user.profilePicture || 'https://via.placeholder.com/150'}
                alt="Photo de profil"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Bouton Modifier le profil */}
            <div className="d-flex justify-content-end mt-3">
              <Button 
                variant="outline-primary" 
                className="rounded-pill"
                onClick={handleEditProfile}
              >
                Modifier le profil
              </Button>
            </div>

            {/* Nom d'utilisateur et bio */}
            <div className="mt-3">
              <h3 className="fw-bold mb-0">{user.username}</h3>
              <p className="text-muted">@{user.username}</p>
              <p>{user.bio}</p>
            </div>

            {/* Statistiques (abonnements et abonnés) */}
            <div className="d-flex gap-3 mt-3 mb-4">
              <div>
                <span className="fw-bold">{user.following.length}</span>{' '}
                <span className="text-muted">Abonnements</span>
              </div>
              <div>
                <span className="fw-bold">{user.followers.length}</span>{' '}
                <span className="text-muted">Abonnés</span>
              </div>
            </div>

            {/* Section des tweets */}
            <div className="mt-4">
              <h4 className="mb-3">Publications</h4>
              
              {tweetsLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : userTweets.length > 0 ? (
                userTweets.map(tweet => (
                  <Tweet 
                    key={tweet._id}
                    tweet={tweet}
                    userId={userId}
                    onTweetUpdated={refreshTweets}
                  />
                ))
              ) : (
                <div className="text-center py-4 text-muted">
                  <p>Aucune publication pour le moment</p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default TwitterLikeProfile;