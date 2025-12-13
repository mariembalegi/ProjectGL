import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Bienvenue dans votre espace personnel</p>
        <button 
          className="logout-btn"
          onClick={() => {
            // Déconnexion simple pour le moment
            window.location.href = '/';
          }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Dashboard;