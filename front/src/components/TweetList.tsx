import React, { useEffect, useState } from 'react';
import CreateTweet from './CreateTweet';
import Tweet from './tweets/Tweet';
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
    bookmarks: string[];
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
          Authorization: `Bearer ${token}`,
        },
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

  // Fonction pour récupérer l'ID de l'utilisateur connecté depuis le token
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
        <div>
          <CreateTweet onTweetCreated={fetchTweets} />
          {/* Liste des tweets */}
          {tweets.map((tweet) => (
            <Tweet
              key={tweet._id}
              tweet={tweet}
              userId={userId}
              onTweetUpdated={fetchTweets}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TweetList;