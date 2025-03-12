import { useState, FormEvent } from 'react';
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
          image: imageUrl || null, // Envoyer l'URL de l'image si elle existe
          video: videoUrl || null, // Envoyer l'URL de la vidéo si elle existe
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du tweet');
      }

      const data = await response.json();
      onTweetCreated(data); // Appeler la fonction de rappel pour actualiser la liste des tweets
      setContent(''); // Réinitialiser le champ de texte
      setImageUrl(''); // Réinitialiser l'URL de l'image
      setVideoUrl(''); // Réinitialiser l'URL de la vidéo
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la création du tweet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        {/* Champ de texte pour le contenu du tweet */}
        <textarea
          className="form-control mb-3"
          rows={3}
          placeholder="Quoi de neuf ?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />

        {/* Champ pour l'URL de l'image */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="URL de l'image (optionnel)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Champ pour l'URL de la vidéo */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="URL de la vidéo (optionnel)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Bouton pour publier le tweet */}
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Publication...' : 'Publier'}
          </button>
        </div>

        {/* Aperçu de l'image ou de la vidéo */}
        {imageUrl && (
          <div className="mb-3">
            <img
              src={imageUrl}
              alt="Preview"
              className="img-fluid rounded"
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}

        {videoUrl && (
          <div className="mb-3">
            <video
              src={videoUrl}
              controls
              className="img-fluid rounded"
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTweet;