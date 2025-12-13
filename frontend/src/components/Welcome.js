import React, { useState, useRef } from 'react';
import './Welcome.css';
import './Modal.css';

const Welcome = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedConvention, setSelectedConvention] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' pour croissant, 'desc' pour décroissant
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const itemsPerPage = 10;

  const handleLogout = () => {
    window.location.href = '/';
  };

  const handleViewConvention = (convention) => {
    setSelectedConvention(convention);
    setShowModal(true);
  };

  const handleAddRequest = () => {
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedConvention(null);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedFiles([]);
    setDragActive(false);
    setFormData({ title: '', type: '', description: '' });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Request title is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Convention type is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (selectedFiles.length === 0) {
      newErrors.documents = 'At least one document is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitRequest = () => {
    // Valider le formulaire
    if (!validateForm()) {
      return;
    }

    // Créer une nouvelle convention
    const newConvention = {
      id: conventions.length + 1,
      titre: formData.title,
      chercheur: formData.description,
      type: formData.type,
      date: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
      statut: 'In Progress'
    };

    // Ajouter à la liste
    setConventions(prev => [newConvention, ...prev]);
    
    // Fermer le modal et réinitialiser
    closeAddModal();
  };

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...fileArray]);
    // Clear document error when files are added
    if (errors.documents) {
      setErrors(prev => ({ ...prev, documents: '' }));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileAreaClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Données fictives pour le dashboard
  const stats = [
    { title: 'Total Requests', value: 20, color: '#3B82F6' },
    { title: 'In Progress', value: 20, color: '#F59E0B' },
    { title: 'To Modify', value: 0, color: '#8B5CF6' },
    { title: 'Approved', value: 0, color: '#10B981' },
    { title: 'Rejected', value: 0, color: '#EF4444' }
  ];

  const [conventions, setConventions] = useState([
    {
      id: 1,
      titre: 'Exchange Agreement',
      chercheur: 'University exchange program for students',
      type: 'Student Exchange',
      date: '15 Nov 2025',
      statut: 'In Progress'
    },
    {
      id: 2,
      titre: 'Double Degree - TU Munich',
      chercheur: 'Academic partnership for double certification',
      type: 'Double Degree',
      date: '12 Nov 2025',
      statut: 'In Progress'
    },
    {
      id: 3,
      titre: 'Training Relocation - MIT',
      chercheur: 'Opening of a training branch abroad',
      type: 'Relocation',
      date: '10 Nov 2025',
      statut: 'In Progress'
    },
    {
      id: 4,
      titre: 'Research Agreement - Oxford',
      chercheur: 'Scientific research collaboration',
      type: 'Research',
      date: '08 Nov 2025',
      statut: 'In Progress'
    },
    {
      id: 5,
      titre: 'Internship Agreement - Sorbonne',
      chercheur: 'Internship program for students in France',
      type: 'Student Exchange',
      date: '05 Nov 2025',
      statut: 'In Progress'
    },
    {
      id: 6,
      titre: 'Partnership - Stanford University',
      chercheur: 'Academic cooperation and research agreement',
      type: 'Research',
      date: '03 Nov 2025',
      statut: 'In Progress'
    },
    {
      id: 7,
      titre: 'Mobility Agreement - Erasmus+',
      chercheur: 'European mobility program',
      type: 'Student Exchange',
      date: '01 Nov 2025',
      statut: 'In Progress'
    },
    {
      id: 8,
      titre: 'Training Agreement - INSA Lyon',
      chercheur: 'Specialized engineering training',
      type: 'Training',
      date: '30 Oct 2025',
      statut: 'In Progress'
    },
    {
      id: 9,
      titre: 'Research Agreement - CERN',
      chercheur: 'Participation in particle physics projects',
      type: 'Research',
      date: '28 Oct 2025',
      statut: 'In Progress'
    },
    {
      id: 10,
      titre: 'Double Degree - Polytechnique Montreal',
      chercheur: 'Binational engineering program',
      type: 'Double Degree',
      date: '25 Oct 2025',
      statut: 'In Progress'
    },
    {
      id: 11,
      titre: 'Internship Agreement - ETH Zurich',
      chercheur: 'Research internships in advanced technologies',
      type: 'Internship',
      date: '23 Oct 2025',
      statut: 'In Progress'
    },
    {
      id: 12,
      titre: 'Mobility Agreement - University of Tokyo',
      chercheur: 'Academic exchange with Japan',
      type: 'Student Exchange',
      date: '20 Oct 2025',
      statut: 'In Progress'
    },
    {
      id: 13,
      titre: 'Training Agreement - École Centrale Paris',
      chercheur: 'Elite engineering training',
      type: 'Training',
      date: '18 Oct 2025',
      statut: 'In Progress'
    },
    {
      id: 14,
      titre: 'Research Partnership - Harvard Medical',
      chercheur: 'Collaborative biomedical research',
      type: 'Research',
      date: '15 Oct 2025',
      statut: 'In Progress'
    },
    {
      id: 15,
      titre: 'Exchange Agreement - KTH Stockholm',
      chercheur: 'Nordic exchange program',
      type: 'Student Exchange',
      date: '12 Oct 2025',
      statut: 'In Progress'
    },
    {
      id: 16,
      titre: 'Training Agreement - EPFL',
      chercheur: 'Specialized training in microtechnologies',
      type: 'Training',
      date: '10 Oct 2025',
      statut: 'In Progress'
    },
    {
      id: 17,
      titre: 'Research Agreement - Caltech',
      chercheur: 'Research in space technologies',
      type: 'Research',
      date: '08 Oct 2025',
      statut: 'In Progress'
    },
    {
      id: 18,
      titre: 'Double Degree - Imperial College',
      chercheur: 'Anglo-Tunisian excellence program',
      type: 'Double Degree',
      date: '05 Oct 2025',
      statut: 'In Progress'
    },
    {
      id: 19,
      titre: 'Internship Agreement - Siemens AG',
      chercheur: 'Industrial internships in Germany',
      type: 'Internship',
      date: '03 Oct 2025',
      statut: 'In Progress'
    },
    {
      id: 20,
      titre: 'Mobility Agreement - McGill University',
      chercheur: 'Exchange with Canada',
      type: 'Student Exchange',
      date: '01 Oct 2025',
      statut: 'In Progress'
    }
  ]);

  const getStatusBadge = (statut) => {
    const statusClasses = {
      'In Progress': 'status-progress',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected',
      'To Modify': 'status-modify'
    };
    return statusClasses[statut] || 'status-default';
  };

  const filteredConventions = selectedFilter === 'All' 
    ? conventions 
    : conventions.filter(convention => convention.statut === selectedFilter);

  // Apply sorting
  const sortedConventions = [...filteredConventions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedConventions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentConventions = sortedConventions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortByDate = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Reset to first page when filter changes
  const handleFilterClick = () => {
    const filterOptions = ['All', 'In Progress', 'Approved', 'Rejected', 'To Modify'];
    const currentIndex = filterOptions.indexOf(selectedFilter);
    const nextIndex = (currentIndex + 1) % filterOptions.length;
    setSelectedFilter(filterOptions[nextIndex]);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-container">
            <i className="fas fa-handshake logo-icon"></i>
            <span className="logo-text">Convenia</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${selectedMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => setSelectedMenu('dashboard')}
          >
            <i className="fas fa-home nav-icon"></i>
            Dashboard
          </div>
          <div 
            className={`nav-item ${selectedMenu === 'settings' ? 'active' : ''}`}
            onClick={() => setSelectedMenu('settings')}
          >
            <i className="fas fa-cog nav-icon"></i>
            Settings
          </div>
          <div 
            className={`nav-item ${selectedMenu === 'help' ? 'active' : ''}`}
            onClick={() => setSelectedMenu('help')}
          >
            <i className="fas fa-question-circle nav-icon"></i>
            Help
          </div>
        </nav>
        
        {/* User Profile at bottom */}
        <div className="user-profile-sidebar">
          <div className="profile-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="profile-info">
            <span className="profile-name">Mariem Balegi</span>
            <small className="profile-role">TIC</small>
          </div>
          <div className="logout-icon" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className="projects-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Requests</h2>
              <p>Create and track requests</p>
            </div>
            <div className="section-actions">
              <button className="btn-primary add-btn" onClick={handleAddRequest} title="Add new request">
                <i className="fas fa-plus"></i>
              </button>
              <button className="btn-secondary filter-btn" onClick={handleFilterClick} title={`Filtrer par: ${selectedFilter}`}>
                <i className="fas fa-filter"></i>
                {selectedFilter !== 'All' && <span className="filter-text">{selectedFilter}</span>}
              </button>
              <button className="btn-secondary" onClick={handleSortByDate} title={`Sort by date: ${sortOrder === 'asc' ? 'Oldest first' : 'Newest first'}`}>
                <i className={`fas ${sortOrder === 'asc' ? 'fa-sort-amount-up' : 'fa-sort-amount-down'}`}></i>
              </button>
            </div>
          </div>

          {/* Projects Table */}
          <div className="projects-table">
            <div className="table-header">
              <div className="col-title">Request Title</div>
              <div className="col-researcher">Description</div>
              <div className="col-type">Type</div>
              <div className="col-date">Submission Date</div>
              <div className="col-status">Status</div>
              <div className="col-actions">Actions</div>
            </div>
            
            {currentConventions.map((convention) => (
              <div key={convention.id} className="table-row">
                <div className="col-title">
                  <strong>{convention.titre}</strong>
                </div>
                <div className="col-researcher">{convention.chercheur}</div>
                <div className="col-type">{convention.type}</div>
                <div className="col-date">{convention.date}</div>
                <div className="col-status">
                  <span className={`status-badge ${getStatusBadge(convention.statut)}`}>
                    {convention.statut}
                  </span>
                </div>
                <div className="col-actions">
                  <button className="action-btn view" onClick={() => handleViewConvention(convention)}><i className="fas fa-eye"></i></button>
                  <button className="action-btn edit"><i className="fas fa-edit"></i></button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <span className="pagination-info">
                Showing {startIndex + 1}-{Math.min(endIndex, sortedConventions.length)} of {sortedConventions.length} results
              </span>
              
              <div className="pagination-controls">
                <button 
                  className="pagination-btn" 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  className="pagination-btn" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal Popup */}
      {showModal && selectedConvention && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <h2 className="modal-title">{selectedConvention.titre}</h2>
            
            <div className="modal-form">
              <div className="form-group">
                <label>Convention Type</label>
                <input type="text" value={selectedConvention.type} readOnly />
              </div>
              
              <div className="form-group">
                <label>Submission Date</label>
                <input type="text" value={selectedConvention.date} readOnly />
              </div>
              
              <div className="form-group">
                <label>Workflow Chain</label>
              </div>
              
              <div className="workflow-status">
                <div className="status-item pending">
                  <div className="status-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <span>DRI - Pending</span>
                </div>
                
                <div className="status-item">
                  <div className="status-icon">
                    <i className="fas fa-circle"></i>
                  </div>
                  <span>DEVE</span>
                </div>
                
                <div className="status-item">
                  <div className="status-icon">
                    <i className="fas fa-circle"></i>
                  </div>
                  <span>CEVU</span>
                </div>
                
                <div className="status-item">
                  <div className="status-icon">
                    <i className="fas fa-circle"></i>
                  </div>
                  <span>CA</span>
                </div>
              </div>
              
              <div className="form-group">
                <label>Documents</label>
                <div className="document-item">
                  <i className="fas fa-file-pdf"></i>
                  <span>Convention_projet.pdf</span>
                  <i className="fas fa-download"></i>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn-close" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Request Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeAddModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <h2 className="modal-title">Add New Request</h2>
            
            <div className="modal-form">
              <div className="form-group">
                <label>Request Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter request title"
                  className={errors.title ? 'error' : ''}
                />
              </div>
              
              <div className="form-group">
                <label>Convention Type</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={errors.type ? 'error' : ''}
                >
                  <option value="" disabled>Select convention type</option>
                  <option value="Student Exchange">Student Exchange</option>
                  <option value="Double Degree">Double Degree</option>
                  <option value="Research">Research</option>
                  <option value="Training">Training</option>
                  <option value="Internship">Internship</option>
                  <option value="Relocation">Relocation</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter detailed description" 
                  rows="4"
                  className={errors.description ? 'error' : ''}
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Upload Documents</label>
                <div 
                  className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${errors.documents ? 'error' : ''}`}
                  onClick={handleFileAreaClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <i className="fas fa-cloud-upload-alt"></i>
                  <p>Drag and drop files here or click to browse</p>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple 
                    accept=".pdf" 
                    style={{display: 'none'}} 
                    onChange={handleFileInputChange}
                  />
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="selected-files">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <i className="fas fa-file"></i>
                        <span className="file-name">{file.name}</span>
                        <button 
                          type="button" 
                          className="remove-file"
                          onClick={() => removeFile(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn-close" onClick={closeAddModal}>
                Cancel
              </button>
              <button className="btn-primary-modal" onClick={handleSubmitRequest}>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;