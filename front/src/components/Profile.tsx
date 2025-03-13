import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tweet from './tweets/Tweet'; // Import the Tweet component

const TwitterLikeProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams(); // Extract username from URL
  
  const [user, setUser] = useState({
    username: '',
    bio: '',
    profilePicture: '',
    bannerPicture: '',
    followers: [],
    following: [],
    _id: '', // Store user ID to check if this is the current user's profile
  });

  const [userTweets, setUserTweets] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [tweetsLoading, setTweetsLoading] = useState(true);

  // Get current user ID from token
  useEffect(() => {
    const getUserIdFromToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id);
        return payload.id;
      }
      return null;
    };
    
    const currentUserId = getUserIdFromToken();
    
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const endpoint = username ? `http://localhost:5201/api/users/${username}` : 'http://localhost:5201/api/users';

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const userData = await response.json();
        
        // Check if this is the current user's profile
        setIsOwnProfile(currentUserId === userData._id);
        
        // Check if current user is following this profile
        setIsFollowing(userData.followers.includes(currentUserId));
        
        // Update user state
        setUser({
          username: userData.username,
          bio: userData.bio || '',
          profilePicture: userData.profilePicture || '',
          bannerPicture: userData.bannerPicture || '',
          followers: userData.followers || [],
          following: userData.following || [],
          _id: userData._id,
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]); // Re-fetch when username changes

  // Handle follow/unfollow function
  const handleFollowToggle = async () => {
    console.log("Handle follow toggle");
    if (!userId || !username) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5201/api/users/follow/${username}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        // Toggle the following state locally
        setIsFollowing(!isFollowing);
        
        // Update followers count
        setUser(prevUser => ({
          ...prevUser,
          followers: isFollowing 
            ? prevUser.followers.filter(id => id !== userId) // Remove current user from followers
            : [...prevUser.followers, userId] // Add current user to followers
        }));
      } else {
        console.error('Failed to follow/unfollow user');
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  // Fetch tweets for this profile
  useEffect(() => {
    const fetchUserTweets = async () => {
      if (!user._id && !username) return; // Don't fetch if no user data yet
      
      try {
        const token = localStorage.getItem('token');
        const endpoint = username 
          ? `http://localhost:5201/api/tweets/getuserprofile/${username}`
          : 'http://localhost:5201/api/tweets/getuserprofile';
          
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const tweetsData = await response.json();
          setUserTweets(tweetsData);
        } else {
          console.error('Error fetching tweets');
        }
      } catch (error) {
        console.error('Error fetching tweets:', error);
      } finally {
        setTweetsLoading(false);
      }
    };

    fetchUserTweets();
  }, [user._id, username]);

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const refreshTweets = async () => {
    setTweetsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = username 
        ? `http://localhost:5201/api/tweets/getuserprofile/${username}`
        : 'http://localhost:5201/api/tweets/getuserprofile';
        
      const response = await fetch(endpoint, {
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
      console.error('Error refreshing tweets:', error);
    } finally {
      setTweetsLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Chargement du profil...</div>;
  }

  return (
    <Container fluid className="p-0">
      {/* Banner */}
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

      {/* Profile info */}
      <Container>
        <Row className="mt-4">
          <Col>
            {/* Profile picture */}
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

            {/* Only show Edit button if it's the current user's profile */}
            <div className="d-flex justify-content-end mt-3">
              {isOwnProfile ? (
                <Button 
                  variant="outline-primary" 
                  className="rounded-pill"
                  onClick={handleEditProfile}
                >
                  Modifier le profil
                </Button>
              ) : (
                <Button 
                  variant={isFollowing ? "outline-danger" : "outline-primary"}
                  className="rounded-pill"
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Ne plus suivre" : "Suivre"}
                </Button>
              )}
            </div>

            {/* Username and bio */}
            <div className="mt-3">
              <h3 className="fw-bold mb-0">{user.username}</h3>
              <p className="text-muted">@{user.username}</p>
              <p>{user.bio}</p>
            </div>

            {/* Stats */}
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

            {/* Tweets section */}
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