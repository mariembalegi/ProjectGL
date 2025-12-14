import React, { useEffect, useMemo, useState } from 'react';
import './DashboardAdmin.css';

const initialUsers = [
  { id: 1, name: 'Alice Martin', email: 'alice@example.com', password: 'pass123', role: 'enseignant', department: 'Math', active: true },
  { id: 2, name: 'Bob Durand', email: 'bob@example.com', password: 'adminpass', role: 'admin', department: 'Administration', active: true },
  { id: 3, name: 'Carla Lopez', email: 'carla@example.com', password: 'secret', role: 'enseignant', department: 'Physics', active: false },
];

const initialProjects = [
  { id: 1, title: 'Projet Calcul', authorId: 1, status: 'pending' },
  { id: 2, title: 'Projet Physique', authorId: 3, status: 'rejected' },
  { id: 3, title: 'Projet IA', authorId: 1, status: 'approved' },
];

const DashboardAdmin = () => {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState(initialProjects);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [selectedProjectsUser, setSelectedProjectsUser] = useState(null);

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'enseignant', department: '' });

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        const loadedProjects = JSON.parse(savedProjects);
        // Map Welcome.js format to DashboardAdmin format
        const mappedProjects = loadedProjects.map(p => ({
          id: p.id,
          title: p.titre,
          authorId: p.id,
          status: p.statut.toLowerCase() === 'in progress' ? 'pending' : p.statut.toLowerCase()
        }));
        setProjects(mappedProjects);
      } catch (e) {
        console.error('Error loading projects:', e);
      }
    }
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter(u => u.role === 'admin').length;
    const active = users.filter(u => u.active).length;
    return { total, admins, active };
  }, [users]);

  const handleLogout = () => {
    window.location.href = '/';
  };

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addTeacher = () => {
    if (!form.name || !form.email) return alert('Nom et email requis');
    const newUser = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      password: form.password || 'changeme',
      role: 'enseignant',
      department: form.department || 'Général',
      active: true,
    };
    setUsers(prev => [newUser, ...prev]);
    setForm({ name: '', email: '', password: '', role: 'enseignant', department: '' });
    setShowAddTeacher(false);
  };

  const addAdmin = () => {
    if (!form.name || !form.email || !form.password) return alert('Nom, email et mot de passe requis');
    const newUser = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      password: form.password,
      role: 'admin',
      department: 'Administration',
      active: true,
    };
    setUsers(prev => [newUser, ...prev]);
    setForm({ name: '', email: '', password: '', role: 'enseignant', department: '' });
    setShowAddAdmin(false);
  };

  const changeProjectStatus = (projectId, status) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status } : p));
  };

  const openProjectsForUser = (userId) => {
    setSelectedProjectsUser(userId);
  };

  const closeProjects = () => setSelectedProjectsUser(null);

  const toggleAdmin = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u));
  };

  const toggleActive = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const filtered = users.filter(u => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  return (
    <div className="admin-dashboard-container">
      <div className="logout-button-container">
        <button className="logout-btn" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>

      <header className="admin-header">
        <h1>Tableau de bord - Admin</h1>
        <p className="subtitle">Gestion des utilisateurs et statistiques rapides</p>
      </header>

      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Utilisateurs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.admins}</div>
          <div className="stat-label">Admins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Actifs</div>
        </div>
      </section>

      <section className="users-section">
        <div className="users-controls">
          <input
            type="search"
            placeholder="Rechercher par nom, email ou rôle"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search-input"
          />
          <button className="btn" onClick={() => setShowAddTeacher(true)}>Ajouter Enseignant</button>
          <button className="btn" onClick={() => setShowAddAdmin(true)}>Ajouter Admin</button>
          <div className="users-count">Résultats: {filtered.length}</div>
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Mot de passe</th>
              <th>Rôle</th>
              <th>Département</th>
              <th>Actif</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className={user.active ? '' : 'inactive'}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password || '—'}</td>
                <td>{user.role}</td>
                <td>{user.department || '—'}</td>
                <td>{user.active ? 'Oui' : 'Non'}</td>
                <td>
                  <button className="btn small" onClick={() => toggleAdmin(user.id)}>
                    {user.role === 'admin' ? 'Retirer admin' : 'Promouvoir'}
                  </button>
                  <button className="btn small" onClick={() => toggleActive(user.id)}>
                    {user.active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button className="btn danger small" onClick={() => handleDelete(user.id)}>Supprimer</button>
                  <button className="btn small" onClick={() => openProjectsForUser(user.id)}>Voir projets</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="no-results">Aucun utilisateur trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="projects-section" style={{ marginTop: '1rem' }}>
        <div className="section-header">
          <div className="section-title">
            <h2>Projets des Enseignants</h2>
            <p>Statut des projets soumis par les enseignants</p>
          </div>
        </div>
        <div style={{ padding: '1rem' }}>
          <table className="users-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Enseignant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.filter(p => {
                const author = users.find(u => u.id === p.authorId);
                return author && author.role === 'enseignant';
              }).map(p => {
                const author = users.find(u => u.id === p.authorId) || { name: 'Inconnu' };
                return (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{author.name}</td>
                    <td>{p.status}</td>
                    <td>
                      <button className="btn small" onClick={() => changeProjectStatus(p.id, 'approved')}>Approuver</button>
                      <button className="btn small" onClick={() => changeProjectStatus(p.id, 'rejected')}>Rejeter</button>
                      <button className="btn small" onClick={() => changeProjectStatus(p.id, 'pending')}>Remettre</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Teacher Modal */}
      {showAddTeacher && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Ajouter Enseignant</h3>
            <label>Nom</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <label>Email</label>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <label>Mot de passe</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <label>Département</label>
            <input value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
            <div className="modal-actions">
              <button className="btn" onClick={addTeacher}>Ajouter</button>
              <button className="btn" onClick={() => setShowAddTeacher(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Ajouter Admin</h3>
            <label>Nom</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <label>Email</label>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <label>Mot de passe</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <div className="modal-actions">
              <button className="btn" onClick={addAdmin}>Ajouter Admin</button>
              <button className="btn" onClick={() => setShowAddAdmin(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Projects for selected user modal */}
      {selectedProjectsUser && (
        <div className="modal-backdrop">
          <div className="modal large">
            <h3>Projets de {users.find(u => u.id === selectedProjectsUser)?.name || 'Utilisateur'}</h3>
            <div>
              {projects.filter(p => p.authorId === selectedProjectsUser).map(p => (
                <div key={p.id} className="project-item">
                  <div className="project-title">{p.title}</div>
                  <div className="project-status">{p.status}</div>
                  <div className="project-actions">
                    <button className="btn small" onClick={() => changeProjectStatus(p.id, 'approved')}>Approuver</button>
                    <button className="btn small" onClick={() => changeProjectStatus(p.id, 'rejected')}>Rejeter</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={closeProjects}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;