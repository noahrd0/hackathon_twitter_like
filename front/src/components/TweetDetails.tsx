import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useParams } from 'react-router-dom';
import Tweet from './tweets/Tweet';

const TweetDetail = () => {
  const { tweetId } = useParams();

  const [tweet, setTweet] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  const fetchTweet = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5201/api/tweets/${tweetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération du tweet');
      const data = await response.json();
      setTweet(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5201/api/tweets/reply/${tweetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des réponses');
      const data = await response.json();
      setReplies(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réponses:', error.message);
    }
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.id);
    }
  };

  useEffect(() => {
    fetchTweet();
    fetchReplies();
    getUserIdFromToken();
  }, [tweetId]);

  if (loading) return <div className="text-center mt-5">Chargement en cours...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!tweet) return <div className="alert alert-warning mt-5">Tweet non trouvé</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Tweet tweet={tweet} userId={userId} onTweetUpdated={fetchTweet} />
          <h4 className="mt-4 mb-3">Réponses</h4>
          {replies.length > 0 ? (
            replies.map((reply) => (
              <Tweet key={reply._id} tweet={reply} userId={userId} onTweetUpdated={fetchReplies} />
            ))
          ) : (
            <p className="text-muted">Aucune réponse pour ce tweet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetDetail;
