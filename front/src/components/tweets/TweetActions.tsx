import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface TweetActionsProps {
  tweetId: string;
  likes: string[];
  retweets: string[];
  bookmarks: string[];
  userId: string | null;
  onLike: (tweetId: string) => void;
  onRetweet: (tweetId: string) => void;
  onReply: (tweetId: string) => void;
  onBookmark: (tweetId: string) => void;
}

const TweetActions = ({
  tweetId,
  likes,
  retweets,
  bookmarks,
  userId,
  onLike,
  onRetweet,
  onReply,
  onBookmark,
}: TweetActionsProps) => {
  const hasLiked = userId && likes.includes(userId); // Vérifie si l'utilisateur a liké le tweet
  const hasRetweeted = userId && retweets.includes(userId); // Vérifie si l'utilisateur a retweeté le tweet
  const hasBookmarked = userId && bookmarks.includes(userId); // Vérifie si l'utilisateur a enregistré le tweet

  return (
    <div className="d-flex justify-content-between">
      {/* Bouton Like */}
      <button
        className={`btn btn-outline-secondary btn-sm ${hasLiked ? 'text-danger' : ''}`}
        onClick={() => onLike(tweetId)}
      >
        <i className={`bi ${hasLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i> {likes.length}
      </button>

      {/* Bouton Retweet */}
      <button
        className={`btn btn-outline-secondary btn-sm ${hasRetweeted ? 'text-success' : ''}`}
        onClick={() => onRetweet(tweetId)}
      >
        <i className="bi bi-repeat"></i> {retweets.length}
      </button>

      {/* Bouton Répondre */}
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={() => onReply(tweetId)}
      >
        <i className="bi bi-chat"></i>
      </button>

      {/* Bouton Bookmark */}
      <button
        className={`btn btn-outline-secondary btn-sm ${hasBookmarked ? 'text-warning' : ''}`}
        onClick={() => onBookmark(tweetId)}
      >
        <i className={`bi ${hasBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
      </button>
    </div>
  );
};

export default TweetActions;