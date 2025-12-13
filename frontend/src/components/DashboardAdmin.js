import React from 'react';
import './DashboardAdmin.css';

const DashboardAdmin = () => {
  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className="admin-dashboard-container">
      <div className="logout-button-container">
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          Déconnexion
        </button>
      </div>
      <div className="admin-content">
        <h1>BONJOUR</h1>
      </div>
    </div>
  );
};

export default DashboardAdmin;