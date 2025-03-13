import { useState, useEffect } from 'react';
import { Container, ListGroup, Image, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Define types for our data
interface User {
  username: string;
  profilePicture?: string;
}

interface Tweet {
  content: string;
}

interface Notification {
  type: 'like' | 'retweet' | string;
  user: User;
  tweet: Tweet;
  timestamp: string | Date;
}

const Notifications = () => {
  // État pour stocker les notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // État pour gérer le chargement
  const [loading, setLoading] = useState(true);

  // Effet pour récupérer les notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5201/api/tweets/notifications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Fonction pour formater la date
  const formatDate = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour formater le message de la notification
  const getNotificationMessage = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.user.username} a aimé votre tweet`;
      case 'retweet':
        return `${notification.user.username} a retweeté votre tweet`;
      default:
        return 'Nouvelle notification';
    }
  };

  // Si les données sont en cours de chargement
  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <div className="text-center my-5">
          <i className="bi bi-bell fs-1 text-muted mb-3 d-block"></i>
          <p className="text-muted">Aucune notification pour le moment</p>
        </div>
      ) : (
        <ListGroup>
          {notifications.map((notification, index) => (
            <ListGroup.Item key={index} className="d-flex align-items-center">
              {/* Photo de profil de l'utilisateur */}
              <Image
                src={notification.user.profilePicture || 'https://via.placeholder.com/50'}
                roundedCircle
                width={50}
                height={50}
                className="me-3"
              />

              {/* Contenu de la notification */}
              <div>
                <p className="mb-1">{getNotificationMessage(notification)}</p>
                <small className="text-muted">
                  {formatDate(notification.timestamp)}
                </small>

                {/* Aperçu du tweet */}
                <div className="mt-2 p-2 bg-light rounded">
                  <p className="mb-0">{notification.tweet.content}</p>
                </div>
              </div>

              {/* Badge pour le type de notification */}
              <Badge
                bg={notification.type === 'like' ? 'primary' : 'success'}
                className="ms-auto"
              >
                {notification.type === 'like' ? 'Like' : 'Retweet'}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default Notifications;