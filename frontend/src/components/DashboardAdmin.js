import React, { useEffect, useMemo, useState } from 'react';
import './DashboardAdmin.css';

const departments = ['TIC', 'MATHEMATIC', 'ELECTRONIC', 'MECANIC', 'CIVIL', 'INDUSTRIAL'];

const initialUsers = [
  { id: 1, name: 'Alice Martin', email: 'alice@example.com', password: 'pass123', role: 'teacher', department: 'MATHEMATIC', active: true },
  { id: 2, name: 'Bob Durand', email: 'bob@example.com', password: 'adminpass', role: 'admin', department: 'Administration', active: true },
  { id: 3, name: 'Carla Lopez', email: 'carla@example.com', password: 'secret', role: 'teacher', department: 'TIC', active: false },
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

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'teacher', department: '' });

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
    if (!window.confirm('Delete this user?')) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addTeacher = () => {
    if (!form.name || !form.email || !form.department) return alert('Name, email, and department are required');
    const newUser = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      password: form.password || 'changeme',
      role: 'teacher',
      department: form.department,
      active: true,
    };
    setUsers(prev => [newUser, ...prev]);
    setForm({ name: '', email: '', password: '', role: 'teacher', department: '' });
    setShowAddTeacher(false);
  };

  const addAdmin = () => {
    if (!form.name || !form.email || !form.password) return alert('Name, email, and password are required');
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
    setForm({ name: '', email: '', password: '', role: 'teacher', department: '' });
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
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: u.role === 'admin' ? 'teacher' : 'admin' } : u));
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
          Logout
        </button>
      </div>

      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">User Management & Quick Statistics</p>
      </header>

      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.admins}</div>
          <div className="stat-label">Admins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
      </section>

      <section className="users-section">
        <div className="users-controls">
          <input
            type="search"
            placeholder="Search by name, email or role"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search-input"
          />
          <button className="btn" onClick={() => setShowAddTeacher(true)}>Add Teacher</button>
          <button className="btn" onClick={() => setShowAddAdmin(true)}>Add Admin</button>
          <div className="users-count">Results: {filtered.length}</div>
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
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
                <td>
                  <button className="btn small" onClick={() => toggleAdmin(user.id)}>
                    {user.role === 'admin' ? 'Remove Admin' : 'Promote'}
                  </button>
                  <button className="btn small" onClick={() => toggleActive(user.id)}>
                    {user.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="btn danger small" onClick={() => handleDelete(user.id)}>Delete</button>
                  <button className="btn small" onClick={() => openProjectsForUser(user.id)}>View Projects</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="no-results">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="projects-section" style={{ marginTop: '1rem' }}>
        <div className="section-header">
          <div className="section-title">
            <h2>Teacher Projects</h2>
            <p>Status of projects submitted by teachers</p>
          </div>
        </div>
        <div style={{ padding: '1rem' }}>
          <table className="users-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Teacher</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.filter(p => {
                const author = users.find(u => u.id === p.authorId);
                return author && author.role === 'teacher';
              }).map(p => {
                const author = users.find(u => u.id === p.authorId) || { name: 'Inconnu' };
                return (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{author.name}</td>
                    <td>{p.status}</td>
                    <td>
                      <button className="btn small" onClick={() => changeProjectStatus(p.id, 'approved')}>Approve</button>
                      <button className="btn small" onClick={() => changeProjectStatus(p.id, 'rejected')}>Reject</button>
                      <button className="btn small" onClick={() => changeProjectStatus(p.id, 'pending')}>Reset</button>
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
            <h3>Add Teacher</h3>
            <label>Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <label>Email</label>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <label>Department</label>
            <select value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="modal-actions">
              <button className="btn" onClick={addTeacher}>Add</button>
              <button className="btn" onClick={() => setShowAddTeacher(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Add Admin</h3>
            <label>Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <label>Email</label>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <div className="modal-actions">
              <button className="btn" onClick={addAdmin}>Add Admin</button>
              <button className="btn" onClick={() => setShowAddAdmin(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Projects for selected user modal */}
      {selectedProjectsUser && (
        <div className="modal-backdrop">
          <div className="modal large">
            <h3>Projects of {users.find(u => u.id === selectedProjectsUser)?.name || 'User'}</h3>
            <div>
              {projects.filter(p => p.authorId === selectedProjectsUser).map(p => (
                <div key={p.id} className="project-item">
                  <div className="project-title">{p.title}</div>
                  <div className="project-status">{p.status}</div>
                  <div className="project-actions">
                    <button className="btn small" onClick={() => changeProjectStatus(p.id, 'approved')}>Approve</button>
                    <button className="btn small" onClick={() => changeProjectStatus(p.id, 'rejected')}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={closeProjects}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;