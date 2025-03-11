// src/pages/Home/HomePage.jsx (mise à jour)
import React, { useState } from 'react';
import Tweet from '../../components/tweet/Tweet';
import './HomePage.css';

function HomePage() {
  const [tweets, setTweets] = useState([
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      avatar: 'https://via.placeholder.com/50',
      text: 'Voici mon premier tweet ! #hackathon #react',
      time: '2h',
      likes: 15,
      retweets: 5,
      comments: 3
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'janesmith',
      avatar: 'https://via.placeholder.com/50',
      text: 'Je travaille sur mon projet de hackathon, c\'est passionnant !',
      image: 'https://via.placeholder.com/500x300',
      time: '5h',
      likes: 24,
      retweets: 8,
      comments: 6
    }
  ]);

  return (
    <div className="home-container">
      <div className="home-feed">
        <h2>Accueil</h2>
        <div className="compose-tweet">
          <div className="compose-avatar">
            <img src="https://via.placeholder.com/40" alt="Your avatar" />
          </div>
          <div className="compose-input">
            <textarea placeholder="Quoi de neuf ?" rows="3"></textarea>
            <div className="compose-actions">
              <div className="compose-tools">
                <button><i className="fa fa-image"></i></button>
                <button><i className="fa fa-smile"></i></button>
              </div>
              <button className="compose-submit">IPSSI</button>
            </div>
          </div>
        </div>
        <div className="tweet-list">
          {tweets.map(tweet => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))}
        </div>
      </div>
      <div className="home-sidebar">
        <div className="trending-section">
          <h3>Tendances pour vous</h3>
          <div className="trending-item">
            <span className="trending-topic">#Hackathon</span>
            <span className="trending-count">1,245 tweets</span>
          </div>
          <div className="trending-item">
            <span className="trending-topic">#React</span>
            <span className="trending-count">854 tweets</span>
          </div>
        </div>
        <div className="who-to-follow">
          <h3>Suggestions</h3>
          <div className="suggestion-item">
            <img src="https://via.placeholder.com/40" alt="User avatar" />
            <div>
              <div className="suggestion-name">Antoine Johnson</div>
              <div className="suggestion-username">@robertj</div>
            </div>
            <button className="follow-button">Suivre</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;