import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Tweet from './tweets/Tweet';

const BookmarksList = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5201/api/tweets/bookmark`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des signets');
      const data = await response.json();
      console.log('Bookmarks data:', data);
      setBookmarks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
    fetchBookmarks();
    getUserIdFromToken();
  }, []);

  if (loading) return <div className="text-center mt-5">Chargement en cours...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (bookmarks.length === 0) return <div className="alert alert-warning mt-5">Aucun signet trouvé</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h4 className="mb-4">Vos tweets enregistrés</h4>
          {bookmarks.map((tweet) => (
            <Tweet
              key={tweet._id}
              tweet={tweet}
              userId={userId}
              onTweetUpdated={fetchBookmarks}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookmarksList;