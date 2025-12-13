const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Base de données simulée en mémoire (remplacez par une vraie DB en production)
const users = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@convenia.com',
        password: '$2a$10$8K8Z8K8Z8K8Z8K8Z8K8Z8Om1.V/nEHvz.5hOcvE.LQJ8L8L8L8L8L8' // 'admin123'
    },
    {
        id: 2,
        username: 'user',
        email: 'user@convenia.com',
        password: '$2a$10$9K9Z9K9Z9K9Z9K9Z9K9Z9Om2.V/nEHvz.6hOcvE.LQJ9L9L9L9L9L9' // 'user123'
    }
];

// Clé secrète JWT (en production, utilisez une variable d'environnement)
const JWT_SECRET = 'convenia_jwt_secret_key_2024';

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: 'Token d\'accès requis' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide' });
        }
        req.user = user;
        next();
    });
};

// Fonction pour générer un JWT
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            username: user.username,
            email: user.email 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Route d'inscription
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validation des champs
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Tous les champs sont requis' 
            });
        }
        
        if (username.length < 3) {
            return res.status(400).json({ 
                message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' 
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Le mot de passe doit contenir au moins 6 caractères' 
            });
        }
        
        if (!email.includes('@')) {
            return res.status(400).json({ 
                message: 'Adresse email invalide' 
            });
        }
        
        // Vérifier si l'utilisateur existe déjà
        const existingUser = users.find(u => 
            u.username.toLowerCase() === username.toLowerCase() || 
            u.email.toLowerCase() === email.toLowerCase()
        );
        
        if (existingUser) {
            return res.status(409).json({ 
                message: 'Un utilisateur avec ce nom ou cet email existe déjà' 
            });
        }
        
        // Hasher le mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Créer le nouvel utilisateur
        const newUser = {
            id: users.length + 1,
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            createdAt: new Date()
        };
        
        // Ajouter à la base de données
        users.push(newUser);
        
        res.status(201).json({ 
            message: 'Utilisateur créé avec succès',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
        
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ 
            message: 'Erreur interne du serveur' 
        });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        const { username, password, remember } = req.body;
        
        // Validation des champs
        if (!username || !password) {
            return res.status(400).json({ 
                message: 'Nom d\'utilisateur et mot de passe requis' 
            });
        }
        
        // Rechercher l'utilisateur
        const user = users.find(u => 
            u.username.toLowerCase() === username.toLowerCase() ||
            u.email.toLowerCase() === username.toLowerCase()
        );
        
        if (!user) {
            return res.status(401).json({ 
                message: 'Identifiants invalides' 
            });
        }
        
        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Identifiants invalides' 
            });
        }
        
        // Générer le token JWT
        const token = generateToken(user);
        
        // Configuration du cookie
        const cookieOptions = {
            httpOnly: true, // Prévient l'accès par JavaScript côté client
            secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en production
            sameSite: 'lax',
            maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 jours ou 24h
        };
        
        res.cookie('token', token, cookieOptions);
        
        res.json({ 
            message: 'Connexion réussie',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ 
            message: 'Erreur interne du serveur' 
        });
    }
});

// Route de vérification du statut d'authentification
router.get('/check', authenticateToken, (req, res) => {
    res.json({ 
        authenticated: true,
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email
        }
    });
});

// Route de profil utilisateur
router.get('/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        }
    });
});

// Route de déconnexion
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    
    res.json({ message: 'Déconnexion réussie' });
});

// Route pour changer le mot de passe
router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                message: 'Mot de passe actuel et nouveau requis' 
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' 
            });
        }
        
        const user = users.find(u => u.id === req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        // Vérifier l'ancien mot de passe
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
        }
        
        // Hasher le nouveau mot de passe
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        
        res.json({ message: 'Mot de passe modifié avec succès' });
        
    } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

module.exports = { router, authenticateToken };