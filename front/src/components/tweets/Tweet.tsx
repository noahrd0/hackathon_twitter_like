import React from 'react';
import TweetActions from './TweetActions';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
    replyTo?: string;
    timestamp: string;
  };
  userId: string | null;
  onLike: (tweetId: string) => void;
  onRetweet: (tweetId: string) => void;
  onReply: (tweetId: string) => void;
}

const Tweet = ({ tweet, userId, onLike, onRetweet, onReply }: TweetProps) => {
  return (
    <div id={tweet._id} className="card mb-3">
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
        <TweetActions
          tweetId={tweet._id}
          likes={tweet.likes}
          retweets={tweet.retweets}
          userId={userId}
          onLike={onLike}
          onRetweet={onRetweet}
          onReply={onReply}
        />
      </div>
    </div>
  );
};

export default Tweet;