import React from 'react';
import './NotificationsPage.css'; // Assurez-vous d'importer le fichier CSS approprié

const notificationsData = [
  { id: 1, text: "Vous avez un nouveau follower : @john_doe", time: "Il y a 5 minutes" },
  { id: 2, text: "Votre tweet a été retweeté par @jane_doe", time: "Il y a 10 minutes" },
  { id: 3, text: "Nouvelle mention dans un tweet : @cool_guy", time: "Il y a 20 minutes" },
  { id: 4, text: "Vous avez reçu un message direct de @mark_smith", time: "Il y a 1 heure" },
  { id: 5, text: "Votre tweet a gagné 10 likes", time: "Il y a 2 heures" },
];

const NotificationsPage = () => {
  return (
    <div className="notifications-page">
      <h1>Notifications</h1>
      <div className="notifications-list">
        {notificationsData.map((notification) => (
          <div key={notification.id} className="notification-card">
            <div className="notification-text">{notification.text}</div>
            <div className="notification-time">{notification.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
