import { useState, FormEvent, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Define proper type for the props
interface CreateTweetProps {
  onTweetCreated: (data: any) => void;
}

const CreateTweet = ({ onTweetCreated }: CreateTweetProps) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('Le contenu du tweet ne peut pas être vide.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      // Envoyer les données au backend
      const response = await fetch('http://localhost:5201/api/tweets/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          image: imageUrl || null,
          video: videoUrl || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du tweet');
      }

      const data = await response.json();
      onTweetCreated(data);
      setContent('');
      setImageUrl('');
      setVideoUrl('');
      setShowMediaOptions(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la création du tweet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour ajuster automatiquement la hauteur du textarea
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Calculer les caractères restants (280 est la limite Twitter)
  const remainingChars = 280 - content.length;
  const isNearLimit = remainingChars <= 20;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="card border-0 mb-3 shadow-sm">
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
              placeholder="Quoi de neuf ?"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
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
            {(imageUrl || videoUrl) && (
              <div className="position-relative mb-3 border rounded-4 overflow-hidden">
                {imageUrl && (
                  <div className="position-relative">
                    <img
                      src={imageUrl}
                      alt="Aperçu"
                      className="img-fluid w-100 rounded-4"
                      style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                    <button 
                      className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2"
                      onClick={() => setImageUrl('')}
                      style={{ width: '32px', height: '32px', padding: '0' }}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                )}

                {videoUrl && (
                  <div className="position-relative">
                    <video
                      src={videoUrl}
                      controls
                      className="img-fluid w-100 rounded-4"
                      style={{ maxHeight: '300px' }}
                    />
                    <button 
                      className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2"
                      onClick={() => setVideoUrl('')}
                      style={{ width: '32px', height: '32px', padding: '0' }}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Input pour les URLs de médias (s'affiche uniquement si showMediaOptions est true) */}
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
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
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
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
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
                  className="btn btn-link text-primary p-1 me-2"
                  onClick={() => setShowMediaOptions(!showMediaOptions)}
                  disabled={isSubmitting}
                >
                  <i className="bi bi-image fs-5"></i>
                </button>
                <button className="btn btn-link text-primary p-1 me-2" disabled={isSubmitting}>
                  <i className="bi bi-emoji-smile fs-5"></i>
                </button>
                <button className="btn btn-link text-primary p-1" disabled={isSubmitting}>
                  <i className="bi bi-geo-alt fs-5"></i>
                </button>
              </div>

              <div className="d-flex align-items-center">
                {/* Indicateur de caractères restants */}
                {content.length > 0 && (
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
                        {content.length > 0 && (
                          <circle 
                            cx="16" 
                            cy="16" 
                            r="14" 
                            fill="none" 
                            stroke={isOverLimit ? '#dc3545' : isNearLimit ? '#ffc107' : '#1da1f2'} 
                            strokeWidth="3" 
                            strokeDasharray="88" 
                            strokeDashoffset={88 - (88 * Math.min(content.length, 280) / 280)} 
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
                  className="btn btn-primary rounded-pill px-4"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !content.trim() || isOverLimit}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      <span>Publication...</span>
                    </>
                  ) : 'Publier'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTweet;