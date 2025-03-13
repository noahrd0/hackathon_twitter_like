import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

interface TweetProps {
  tweet: {
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
    bookmarks: string[];
    replyTo?: string;
    timestamp: string;
  };
  userId: string | null;
  onTweetUpdated: () => void; // Callback pour actualiser la liste des tweets
}

const Tweet = ({ tweet, userId, onTweetUpdated }: TweetProps) => {
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
        // Actualiser la liste des tweets via le callback
        onTweetUpdated();
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
        // Actualiser la liste des tweets via le callback
        onTweetUpdated();
      }
    } catch (error) {
      console.error('Erreur lors du retweet:', error);
    }
  };

  // Fonction pour ajouter aux signets
  const handleBookmarks = async (tweetId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5201/api/tweets/bookmark/${tweetId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(response);
      if (response.ok) {
        // Actualiser la liste des tweets via le callback
        onTweetUpdated();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux signets:', error);
    }
  }

  // Fonction pour répondre à un tweet
  const navigate = useNavigate();

  const handleReply = (tweetId: string) => {
    navigate(`/tweet/${tweetId}`);
  };
  // Vérifie si l'utilisateur a liké ou retweeté ce tweet
  const hasLiked = userId && tweet.likes.includes(userId);
  const hasRetweeted = userId && tweet.retweets.includes(userId);
  const hasBookmarked = userId && tweet.bookmarks.includes(userId);

  // Styles pour l'adaptation au thème
  const customStyles = `
    .tweet-card {
      background-color: var(--ipssi-card-bg);
      border: 1px solid var(--ipssi-border-color);
      color: var(--ipssi-text-primary);
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
    
    .tweet-text {
      color: var(--ipssi-text-primary);
    }
    
    .tweet-username {
      color: var(--ipssi-text-secondary);
    }
    
    .tweet-action {
      color: var(--ipssi-text-secondary);
      background-color: transparent;
      border-color: var(--ipssi-border-color);
      transition: all 0.2s ease;
    }
    
    .tweet-action:hover {
      background-color: rgba(29, 161, 242, 0.1);
    }
    
    .tweet-action.liked {
      color: #e0245e;
    }
    
    .tweet-action.retweeted {
      color: #17bf63;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div id={tweet._id} className="card mb-3 tweet-card">
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
              <h5 className="card-title mb-0 tweet-text">{tweet.author.username}</h5>
              <small className="tweet-username">
                @{tweet.author.username} · {new Date(tweet.timestamp).toLocaleDateString()}
              </small>
            </div>
          </div>

          {/* Contenu du tweet */}
          <p className="card-text tweet-text">{tweet.content}</p>

          {/* Image ou vidéo du tweet */}
          {tweet.image && (
            <img
              src={tweet.image}
              alt="Tweet"
              className="img-fluid rounded mb-3"
            />
          )}

          {tweet.video && (
            <video
              src={tweet.video}
              controls
              className="img-fluid rounded mb-3"
            />
          )}

          {/* Actions sur le tweet */}
          <div className="d-flex justify-content-between">
            {/* Bouton Like */}
            <button
              className={`btn btn-sm tweet-action ${hasLiked ? 'liked' : ''}`}
              onClick={() => handleLikeTweet(tweet._id)}
            >
              <i className={`bi ${hasLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i> {tweet.likes.length}
            </button>

            {/* Bouton Retweet */}
            <button
              className={`btn btn-sm tweet-action ${hasRetweeted ? 'retweeted' : ''}`}
              onClick={() => handleRetweet(tweet._id)}
            >
              <i className="bi bi-repeat"></i> {tweet.retweets.length}
            </button>

            {/* Bouton Répondre */}
            <button
              className="btn btn-sm tweet-action"
              onClick={() => handleReply(tweet._id)}
            >
              <i className="bi bi-chat"></i>
            </button>

            {/* Bouton Signet */}
            <button className="btn btn-sm tweet-action"
              onClick={() => handleBookmarks(tweet._id)}
            >
              <i className={`bi ${hasBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tweet;