// src/components/tweet/Tweet.jsx
import React, { useState } from 'react';
import './Tweet.css';

function Tweet({ tweet }) {
  const [likes, setLikes] = useState(tweet.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleRetweet = () => {
    setIsRetweeted(!isRetweeted);
    // Logique pour retweet
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Logique pour marque-page
  };

  return (
    <div className="tweet-container">
      <div className="tweet-avatar">
        <img src={tweet.avatar || 'https://via.placeholder.com/50'} alt="avatar" />
      </div>
      
      <div className="tweet-content">
        <div className="tweet-header">
          <span className="tweet-name">{tweet.name}</span>
          <span className="tweet-username">@{tweet.username}</span>
          <span className="tweet-time">{tweet.time}</span>
        </div>
        
        <div className="tweet-text">{tweet.text}</div>
        
        {tweet.image && (
          <div className="tweet-image">
            <img src={tweet.image} alt="tweet media" />
          </div>
        )}
        
        <div className="tweet-actions">
          <button className="tweet-action comment">
            <i className="fa fa-comment"></i>
            <span>{tweet.comments || 0}</span>
          </button>
          
          <button 
            className={`tweet-action retweet ${isRetweeted ? 'active' : ''}`}
            onClick={handleRetweet}
          >
            <i className="fa fa-retweet"></i>
            <span>{tweet.retweets || 0}</span>
          </button>
          
          <button 
            className={`tweet-action like ${isLiked ? 'active' : ''}`}
            onClick={handleLike}
          >
            <i className="fa fa-heart"></i>
            <span>{likes}</span>
          </button>
          
          <button 
            className={`tweet-action bookmark ${isBookmarked ? 'active' : ''}`}
            onClick={handleBookmark}
          >
            <i className="fa fa-bookmark"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tweet;