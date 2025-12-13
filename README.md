# Convenia - Application Full Stack avec Système de Login

Une application web complète développée en JavaScript avec un système d'authentification sécurisé.

## 🚀 Fonctionnalités

### Authentification
- ✅ Connexion utilisateur sécurisée
- ✅ Inscription de nouveaux utilisateurs
- ✅ Chiffrement des mots de passe avec bcrypt
- ✅ Authentification JWT avec cookies
- ✅ Protection des routes
- ✅ Système "Se souvenir de moi"
- ✅ Changement de mot de passe

### Interface Utilisateur
- ✅ Design responsive et moderne
- ✅ Animations CSS fluides
- ✅ Interface de connexion élégante
- ✅ Dashboard complet avec sidebar
- ✅ Gestion du profil utilisateur
- ✅ Paramètres et préférences
- ✅ Mode sombre (en développement)

### Sécurité
- ✅ Cookies HTTP-only pour les tokens
- ✅ Validation côté client et serveur
- ✅ Protection CSRF
- ✅ Hashage des mots de passe
- ✅ Gestion des sessions

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **bcryptjs** - Chiffrement des mots de passe
- **jsonwebtoken** - Authentification JWT
- **cookie-parser** - Gestion des cookies

### Frontend
- **HTML5** - Structure
- **CSS3** - Styles et animations
- **JavaScript (ES6+)** - Logique côté client
- **Font Awesome** - Icônes

## 📁 Structure du Projet

```
Convenia/
├── public/                 # Fichiers statiques
│   ├── css/
│   │   ├── login.css      # Styles page de connexion
│   │   └── dashboard.css  # Styles dashboard
│   ├── js/
│   │   ├── login.js       # Logique page de connexion
│   │   └── dashboard.js   # Logique dashboard
│   ├── login.html         # Page de connexion
│   └── dashboard.html     # Page dashboard
├── routes/
│   └── auth.js           # Routes d'authentification
├── server.js             # Serveur Express principal
├── package.json          # Dépendances et scripts
└── README.md            # Documentation
```

## 🚀 Installation et Démarrage

### 1. Installation des dépendances
```bash
npm install
```

### 2. Démarrage du serveur
```bash
# Mode production
npm start

# Mode développement avec nodemon
npm run dev
```

### 3. Accès à l'application
- **URL principale**: http://localhost:3000
- **Page de connexion**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard (nécessite une authentification)

## 👤 Comptes de Test

Des comptes par défaut sont disponibles pour tester l'application :

### Compte Administrateur
- **Nom d'utilisateur**: `admin`
- **Mot de passe**: `admin123`
- **Email**: admin@convenia.com

### Compte Utilisateur
- **Nom d'utilisateur**: `user`
- **Mot de passe**: `user123`
- **Email**: user@convenia.com

## 🔐 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/check` - Vérification du statut d'authentification
- `GET /api/auth/profile` - Récupération du profil utilisateur
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/change-password` - Changement de mot de passe

### Pages
- `GET /` - Page de connexion
- `GET /dashboard` - Dashboard (protégée)

## ⚙️ Configuration

### Variables d'Environnement
```bash
NODE_ENV=production          # Environnement (development/production)
JWT_SECRET=your_secret_key   # Clé secrète JWT (changez en production)
PORT=3000                    # Port du serveur
```

### Sécurité en Production
- Changez la clé secrète JWT dans `routes/auth.js`
- Activez HTTPS
- Configurez une vraie base de données
- Ajoutez la limitation de taux (rate limiting)
- Configurez les en-têtes de sécurité

## 🎨 Fonctionnalités de l'Interface

### Page de Connexion
- Formulaire de connexion avec validation
- Basculement vers l'inscription
- Messages d'erreur informatifs
- Animations fluides
- Toggle pour voir/masquer le mot de passe

### Dashboard
- Statistiques en temps réel
- Navigation par sidebar responsive
- Gestion du profil utilisateur
- Paramètres de l'application
- Section analytics (extensible)
- Système de notifications toast

## 🔧 Personnalisation

### Ajout de Nouvelles Fonctionnalités
1. Créez de nouvelles routes dans `routes/`
2. Ajoutez les vues dans `public/`
3. Implémentez la logique frontend en JavaScript
4. Stylisez avec CSS

### Base de Données
Actuellement, l'application utilise une base de données en mémoire. Pour la production :
1. Installez MongoDB, PostgreSQL, ou MySQL
2. Remplacez le tableau `users` par une connexion DB
3. Implémentez les modèles de données

## 🐛 Débogage

### Logs
Les erreurs sont affichées dans la console du serveur. Vérifiez :
- Les erreurs d'authentification
- Les problèmes de connexion
- Les erreurs de validation

### Problèmes Courants
1. **Port déjà utilisé** : Changez le port dans `server.js`
2. **Erreurs JWT** : Vérifiez la clé secrète
3. **Problèmes de cookies** : Vérifiez les paramètres du navigateur

## 📈 Améliorations Possibles

### Fonctionnalités
- [ ] Réinitialisation de mot de passe par email
- [ ] Authentification à deux facteurs (2FA)
- [ ] Connexion via réseaux sociaux (OAuth)
- [ ] Gestion des rôles et permissions
- [ ] Upload d'avatar utilisateur
- [ ] Chat en temps réel
- [ ] Notifications push

### Technique
- [ ] Migration vers une vraie base de données
- [ ] Tests unitaires et d'intégration
- [ ] Docker pour le déploiement
- [ ] CI/CD avec GitHub Actions
- [ ] Monitoring et logs avancés
- [ ] Rate limiting et sécurité renforcée

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Mariem** - Développement complet de l'application

---

⭐ N'hésitez pas à donner une étoile au projet si vous l'avez trouvé utile !