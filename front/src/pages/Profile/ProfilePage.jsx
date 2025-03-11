// src/pages/Profile/ProfilePage.jsx
import React from 'react';
import './ProfilePage.css';  // Import du fichier CSS

function ProfilePage() {
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-cover-photo">
          <img src="https://via.placeholder.com/1500x500/1DA1F2/ffffff?text=Cover+Photo" alt="Cover" />
        </div>
        <div className="profile-info">
          <div className="profile-avatar">
            <img src="https://via.placeholder.com/150" alt="User Avatar" />
          </div>
          <h2 className="profile-name">John Doe</h2>
          <p className="profile-bio">Développeur front-end passionné. Aime le café, les voyages et le code.</p>
        </div>
      </div>
      <div className="profile-content">
        <div className="profile-stats">
          <div className="stat">
            <strong>200</strong>
            <p>Abonnés</p>
          </div>
          <div className="stat">
            <strong>180</strong>
            <p>Abonnements</p>
          </div>
          <div className="stat">
            <strong>50</strong>
            <p>Publications</p>
          </div>
        </div>
        <div className="profile-posts">
          <h3>Publications</h3>
          <div className="post">
            <p>Voici un exemple de publication sur mon profil ! #React #Frontend</p>
          </div>
          <div className="post">
            <p>J'adore le JavaScript et j'ai récemment appris les Hooks !</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
