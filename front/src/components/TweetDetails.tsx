import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useParams } from 'react-router-dom';

const TweetDetail = () => {
  const { tweetId } = useParams(); // Récupère l'ID du tweet depuis l'URL

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
    replies: Tweet[]; // Réponses au tweet
    replyTo?: string;
    timestamp: string;
  }

  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [replies, setReplies] = useState<Tweet[]>([]); // État pour les réponses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Fonction pour récupérer le tweet depuis l'API
  const fetchTweet = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5201/api/tweets/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du tweet');
      }
      const data = await response.json();
      setTweet(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les réponses au tweet
  const fetchReplies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5201/api/tweets/reply/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des réponses');
      }
      const data = await response.json();
      setReplies(data); // Stocker les réponses dans l'état
    } catch (error: any) {
      console.error('Erreur lors de la récupération des réponses:', error.message);
      // On ne bloque pas l'affichage du tweet principal en cas d'erreur
    }
  };

  // Fonction pour liker un tweet
  const handleLikeTweet = async (tweetId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5201/api/tweets/like/${tweetId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Actualiser le tweet après le like
        fetchTweet();
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  // Fonction pour retweeter
  const handleRetweet = async (tweetId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5201/api/tweets/retweet/${tweetId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Actualiser le tweet après le retweet
        fetchTweet();
      }
    } catch (error) {
      console.error('Erreur lors du retweet:', error);
    }
  };

  // Fonction pour récupérer l'ID de l'utilisateur connecté depuis le token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Décoder le token JWT
      setUserId(payload.id); // Supposons que l'ID de l'utilisateur est dans le payload
    }
  };

  // Charger le tweet, les réponses et l'ID de l'utilisateur au montage du composant
  useEffect(() => {
    fetchTweet();
    fetchReplies();
    getUserIdFromToken();
  }, [tweetId]);

  if (loading) {
    return <div className="text-center mt-5">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  if (!tweet) {
    return <div className="alert alert-warning mt-5">Tweet non trouvé</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Tweet principal */}
          <div className="card mb-3">
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
                  className={`btn btn-outline-secondary btn-sm ${tweet.likes.includes(userId!) ? 'text-danger' : ''}`}
                  onClick={() => handleLikeTweet(tweet._id)}
                >
                  <i className={`bi ${tweet.likes.includes(userId!) ? 'bi-heart-fill' : 'bi-heart'}`}></i> {tweet.likes.length}
                </button>
                <button
                  className={`btn btn-outline-secondary btn-sm ${tweet.retweets.includes(userId!) ? 'text-success' : ''}`}
                  onClick={() => handleRetweet(tweet._id)}
                >
                  <i className="bi bi-repeat"></i> {tweet.retweets.length}
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-chat"></i> {replies.length}
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-share"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Réponses au tweet */}
          <h4 className="mt-4 mb-3">Réponses</h4>
          {replies.length > 0 ? (
            replies.map((reply) => {
              const hasLiked = userId && reply.likes.includes(userId);
              const hasRetweeted = userId && reply.retweets.includes(userId);

              return (
                <div key={reply._id} className="card mb-3">
                  <div className="card-body">
                    {/* En-tête de la réponse (utilisateur et date) */}
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={reply.author.profilePicture || 'https://via.placeholder.com/50'}
                        alt="Profile"
                        className="rounded-circle me-3"
                        width="50"
                        height="50"
                      />
                      <div>
                        <h5 className="card-title mb-0">{reply.author.username}</h5>
                        <small className="text-muted">
                          @{reply.author.username} · {new Date(reply.timestamp).toLocaleDateString()}
                        </small>
                      </div>
                    </div>

                    {/* Contenu de la réponse */}
                    <p className="card-text">{reply.content}</p>

                    {/* Actions (like, retweet, etc.) */}
                    <div className="d-flex justify-content-between">
                      <button
                        className={`btn btn-outline-secondary btn-sm ${hasLiked ? 'text-danger' : ''}`}
                        onClick={() => handleLikeTweet(reply._id)}
                      >
                        <i className={`bi ${hasLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i> {reply.likes.length}
                      </button>
                      <button
                        className={`btn btn-outline-secondary btn-sm ${hasRetweeted ? 'text-success' : ''}`}
                        onClick={() => handleRetweet(reply._id)}
                      >
                        <i className="bi bi-repeat"></i> {reply.retweets.length}
                      </button>
                      <button className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-chat"></i> 0
                      </button>
                      <button className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-share"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-muted">Aucune réponse pour ce tweet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetDetail;