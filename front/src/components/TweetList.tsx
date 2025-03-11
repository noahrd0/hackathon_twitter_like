import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const TweetList = () => {
  interface Tweet {
    _id: string;
    content: string;
    author: {
      _id: string;
      username: string;
      profilePicture?: string;
    };
    image?: string;
    video?: string;
    hashtags: string[];
    mentions: string[];
    likes: string[];
    retweets: string[];
    replyTo?: string;
    timestamp: string;
  }

  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Fonction pour récupérer les tweets depuis l'API
  const fetchTweets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5201/api/tweets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des tweets');
      }
      const data = await response.json();
      setTweets(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeTweet = async (tweetId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5201/api/tweets/like/${tweetId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Actualiser la liste des tweets
        fetchTweets();
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const handleRetweet = async (tweetId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5201/api/tweets/retweet/${tweetId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Actualiser la liste des tweets
        fetchTweets();
      }
    } catch (error) {
      console.error('Erreur lors du retweet:', error);
    }
  }

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Décoder le token JWT
      setUserId(payload.id); // Supposons que l'ID de l'utilisateur est dans le payload
    }
  };

  // Charger les tweets au montage du composant
  useEffect(() => {
    fetchTweets();
    getUserIdFromToken();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Liste des tweets */}
          {tweets.map((tweet) => {
            const hasLiked = userId && tweet.likes.includes(userId); // Vérifie si l'utilisateur a liké le tweet
            const hasRetweeted = userId && tweet.retweets.includes(userId); // Vérifie si l'utilisateur a retweeté le tweet

            return (
              <div id={tweet._id} key={tweet._id} className="card mb-3">
                <div className="card-body">
                  {/* En-tête du tweet (utilisateur et date) */}
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={tweet.author.profilePicture || 'https://via.placeholder.com/50'}
                      alt="Profile"
                      className="rounded-circle me-3"
                      width="50"
                      height="50"
                    />
                    <div>
                      <h5 className="card-title mb-0">{tweet.author.username}</h5>
                      <small className="text-muted">
                        @{tweet.author.username} · {new Date(tweet.timestamp).toLocaleDateString()}
                      </small>
                    </div>
                  </div>

                  {/* Contenu du tweet */}
                  <p className="card-text">{tweet.content}</p>

                  {/* Image du tweet (optionnelle) */}
                  {tweet.image && (
                    <img
                      src={tweet.image}
                      alt="Tweet"
                      className="img-fluid rounded mb-3"
                    />
                  )}

                  {/* Actions (like, retweet, etc.) */}
                  <div className="d-flex justify-content-between">
                  <button
                    className={`btn btn-outline-secondary btn-sm ${hasLiked ? 'text-danger' : ''}`}
                    onClick={() => handleLikeTweet(tweet._id)}
                  >
                    <i className={`bi ${hasLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i> {tweet.likes.length}
                  </button>
                    <button className={`btn btn-outline-secondary btn-sm ${hasRetweeted ? 'text-success' : ''}`}
                      onClick={() => handleRetweet(tweet._id)}
                    >
                      <i className="bi bi-repeat"></i> {tweet.retweets.length}
                    </button>
                    <button className="btn btn-outline-secondary btn-sm"
                      onClick={() => window.location.href = `/tweet/${tweet._id}`}                    
                    >
                      <i className="bi bi-chat"></i>
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      <i className="bi bi-share"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TweetList;