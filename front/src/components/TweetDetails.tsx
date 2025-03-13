import React, { useEffect, useState, FormEvent, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useParams } from 'react-router-dom';
import Tweet from './tweets/Tweet';

const TweetDetail = () => {
  const { tweetId } = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [tweet, setTweet] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  // Reply form state
  const [replyContent, setReplyContent] = useState('');
  const [replyImageUrl, setReplyImageUrl] = useState('');
  const [replyVideoUrl, setReplyVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);

  // Character limits
  const remainingChars = 280 - replyContent.length;
  const isNearLimit = remainingChars <= 20;
  const isOverLimit = remainingChars < 0;

  // Fonction pour ajuster automatiquement la hauteur du textarea
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleReplySubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      alert('Le contenu de la réponse ne peut pas être vide.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5201/api/tweets/reply/${tweetId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent,
          image: replyImageUrl || null,
          video: replyVideoUrl || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la réponse');
      }

      // Clear form fields
      setReplyContent('');
      setReplyImageUrl('');
      setReplyVideoUrl('');
      setShowMediaOptions(false);
      
      // Fetch updated replies
      fetchReplies();
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la création de la réponse.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div>
          {/* Original tweet */}
          <Tweet tweet={tweet} userId={userId} onTweetUpdated={fetchTweet} />
          
          {/* Reply form - Updated with polished design */}
          <div className="card border-0 mb-3 shadow-sm mt-4">
            <div className="card-body">
              <div className="d-flex mb-3">
                {/* Avatar utilisateur */}
                <div className="me-3">
                  <div className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <i className="bi bi-person-fill fs-4"></i>
                  </div>
                </div>

                {/* Zone de texte principale */}
                <div className="flex-grow-1">
                  <textarea
                    ref={textareaRef}
                    className="form-control border-0 fs-5 mb-3"
                    placeholder="Répondre à ce tweet..."
                    value={replyContent}
                    onChange={(e) => {
                      setReplyContent(e.target.value);
                      adjustHeight();
                    }}
                    disabled={isSubmitting}
                    style={{ 
                      resize: 'none', 
                      minHeight: '80px',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      overflow: 'hidden'
                    }}
                  />

                  {/* Aperçu des médias */}
                  {(replyImageUrl || replyVideoUrl) && (
                    <div className="position-relative mb-3 border rounded-4 overflow-hidden">
                      {replyImageUrl && (
                        <div className="position-relative">
                          <img
                            src={replyImageUrl}
                            alt="Aperçu"
                            className="img-fluid w-100 rounded-4"
                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                          />
                          <button 
                            className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2"
                            onClick={() => setReplyImageUrl('')}
                            style={{ width: '32px', height: '32px', padding: '0' }}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      )}

                      {replyVideoUrl && (
                        <div className="position-relative">
                          <video
                            src={replyVideoUrl}
                            controls
                            className="img-fluid w-100 rounded-4"
                            style={{ maxHeight: '300px' }}
                          />
                          <button 
                            className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2"
                            onClick={() => setReplyVideoUrl('')}
                            style={{ width: '32px', height: '32px', padding: '0' }}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Input pour les URLs de médias */}
                  {showMediaOptions && (
                    <div className="bg-light rounded p-3 mb-3">
                      <div className="mb-2">
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <i className="bi bi-image text-primary"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="URL de l'image"
                            value={replyImageUrl}
                            onChange={(e) => setReplyImageUrl(e.target.value)}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <i className="bi bi-film text-primary"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="URL de la vidéo"
                            value={replyVideoUrl}
                            onChange={(e) => setReplyVideoUrl(e.target.value)}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Barre d'actions et bouton publier */}
                  <div className="d-flex justify-content-between align-items-center border-top pt-3">
                    <div className="d-flex">
                      {/* Boutons d'actions pour ajouter des médias */}
                      <button 
                        type="button"
                        className="btn btn-link text-primary p-1 me-2"
                        onClick={() => setShowMediaOptions(!showMediaOptions)}
                        disabled={isSubmitting}
                      >
                        <i className="bi bi-image fs-5"></i>
                      </button>
                      <button type="button" className="btn btn-link text-primary p-1 me-2" disabled={isSubmitting}>
                        <i className="bi bi-emoji-smile fs-5"></i>
                      </button>
                    </div>

                    <div className="d-flex align-items-center">
                      {/* Indicateur de caractères restants */}
                      {replyContent.length > 0 && (
                        <div className="me-3" style={{ width: '32px', height: '32px' }}>
                          <div className="position-relative d-flex align-items-center justify-content-center">
                            <svg width="32" height="32" viewBox="0 0 32 32">
                              <circle 
                                cx="16" 
                                cy="16" 
                                r="14" 
                                fill="none" 
                                stroke={isOverLimit ? '#dc3545' : isNearLimit ? '#ffc107' : '#e8e8e8'} 
                                strokeWidth="3" 
                              />
                              {replyContent.length > 0 && (
                                <circle 
                                  cx="16" 
                                  cy="16" 
                                  r="14" 
                                  fill="none" 
                                  stroke={isOverLimit ? '#dc3545' : isNearLimit ? '#ffc107' : '#1da1f2'} 
                                  strokeWidth="3" 
                                  strokeDasharray="88" 
                                  strokeDashoffset={88 - (88 * Math.min(replyContent.length, 280) / 280)} 
                                  transform="rotate(-90 16 16)" 
                                />
                              )}
                            </svg>
                            {isNearLimit && (
                              <span 
                                className="position-absolute" 
                                style={{ 
                                  fontSize: '10px', 
                                  color: isOverLimit ? '#dc3545' : isNearLimit ? '#ffc107' : '#1da1f2'
                                }}
                              >
                                {Math.abs(remainingChars)}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bouton de publication */}
                      <button
                        type="button"
                        className="btn btn-primary rounded-pill px-4"
                        onClick={handleReplySubmit}
                        disabled={isSubmitting || !replyContent.trim() || isOverLimit}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            <span>Envoi...</span>
                          </>
                        ) : 'Répondre'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Replies section */}
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
