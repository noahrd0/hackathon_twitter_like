import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Tweet from './tweets/Tweet';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface TweetType {
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

const SearchResults = () => {
  // Get search term from URL parameters
  const { searchQuery } = useParams();
  
  // State for search functionality
  const [searchResults, setSearchResults] = useState<TweetType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID from JWT token
  useEffect(() => {
    const getUserIdFromToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id);
      }
    };
    
    getUserIdFromToken();
  }, []);

  // Perform search when component mounts or search term in URL changes
  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserId(payload.id);
        }
      };
  }, [searchQuery]);

  // Function to call the API and search for tweets
  const performSearch = async (term: string) => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5201/api/tweets/search/${encodeURIComponent(term)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to search tweets');
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error: any) {
      console.error('Error searching tweets:', error);
      setError(error.message || 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh tweets after actions (like, retweet)
  const refreshTweets = () => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };

  return (
    <div className="container mt-3">
      {/* Display loading state */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}

      {/* Display error if any */}
      {error && !loading && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Display search results */}
      {!loading && !error && searchQuery && (
        <div>
          <h4 className="mb-3">
            Résultats pour "{searchQuery}" 
            <span className="text-muted ms-2">({searchResults.length} tweets trouvés)</span>
          </h4>
          
          {searchResults.length === 0 ? (
            <div className="text-center my-5">
              <div className="mb-3">
                <i className="bi bi-search fs-1 text-muted"></i>
              </div>
              <p className="text-muted">Aucun résultat trouvé pour "{searchQuery}"</p>
              <p className="small text-muted">
                Essayez avec d'autres mots-clés ou vérifiez l'orthographe
              </p>
            </div>
          ) : (
            searchResults.map((tweet) => (
              <Tweet
                key={tweet._id}
                tweet={tweet}
                userId={userId}
                onTweetUpdated={refreshTweets}
              />
            ))
          )}
        </div>
      )}

      {/* Empty state before search */}
      {!loading && !error && !searchQuery && (
        <div className="text-center my-5">
          <div className="mb-3">
            <i className="bi bi-search fs-1 text-muted"></i>
          </div>
          <p className="text-muted">Recherchez des tweets par mots-clés, hashtags ou utilisateurs</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;