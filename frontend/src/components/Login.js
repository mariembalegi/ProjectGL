import React, { useState } from 'react';
import './Login.css';
import Welcome from './Welcome';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Utilisateur statique autorisé
  const staticUser = {
    email: 'meriem.balegi@etudiant-enit.utm.tn',
    password: 'mariem12'
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulation d'un délai de traitement
    setTimeout(() => {
      // Vérification des identifiants statiques avec trim pour éviter les espaces
      const emailInput = formData.email.trim();
      const passwordInput = formData.password.trim();
      
      console.log('Email saisi:', emailInput);
      console.log('Password saisi:', passwordInput);
      console.log('Email attendu:', staticUser.email);
      console.log('Password attendu:', staticUser.password);
      
      if (emailInput === staticUser.email && passwordInput === staticUser.password) {
        // Connexion réussie
        setIsLoggedIn(true);
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  // Si l'utilisateur est connecté, afficher la page Welcome
  if (isLoggedIn) {
    return <Welcome />;
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h1>Welcome back!</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password">Password</label>
                <a href="#" className="forgot-password">forgot password</a>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-checkbox">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Remember for 30 days
              </label>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>

      <div className="login-right">
        <div className="geometric-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
          <div className="shape shape-7"></div>
          <div className="shape shape-8"></div>
          <div className="shape shape-9"></div>
          <div className="shape shape-10"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
