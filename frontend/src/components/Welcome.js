import React, { useState, useRef, useEffect } from 'react';
import './Welcome.css';
import './Modal.css';
import { createRequest, getAllRequests } from '../services/api';

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
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef(null);
  const itemsPerPage = 10;
  const [conventions, setConventions] = useState([]);

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

  const handleSubmitRequest = async () => {
    // Valider le formulaire
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setSubmitError('');
      setSubmitMessage('');

      // Get teacher ID from localStorage or use default
      const teacherId = localStorage.getItem('userId') || '1';

      // Submit to backend
      const result = await createRequest(
        {
          title: formData.title,
          type: formData.type,
          description: formData.description,
          teacherId: teacherId
        },
        selectedFiles
      );

      if (result.success) {
        setSubmitMessage('Request submitted successfully!');
        
        // Map backend response to frontend format
        const newConvention = {
          id: result.data.id,
          titre: result.data.title,
          chercheur: result.data.description,
          type: result.data.type,
          date: new Date(result.data.createdAt).toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          }),
          statut: result.data.status,
          documents: result.data.documents || []
        };

        // Add to the beginning of the list
        setConventions(prev => [newConvention, ...prev]);
        
        // Close modal and reset form after a short delay
        setTimeout(() => {
          closeAddModal();
          setSubmitMessage('');
        }, 1500);
      }
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit request');
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
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

  // Load requests from backend on component mount
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const result = await getAllRequests();
        if (result.success && result.data) {
          // Map backend format to frontend format
          const mappedConventions = result.data.map(request => ({
            id: request.id,
            titre: request.title,
            chercheur: request.description,
            type: request.type,
            date: new Date(request.createdAt).toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            }),
            statut: request.status,
            documents: request.documents || []
          }));
          setConventions(mappedConventions);
        }
      } catch (error) {
        console.error('Error loading requests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRequests();
  }, []);

  // Données fictives pour le dashboard - calculated dynamically
  const stats = [
    { title: 'Total Requests', value: conventions.length, color: '#3B82F6' },
    { title: 'In Progress', value: conventions.filter(c => c.statut === 'In Progress').length, color: '#F59E0B' },
    { title: 'To Modify', value: conventions.filter(c => c.statut === 'To Modify').length, color: '#8B5CF6' },
    { title: 'Approved', value: conventions.filter(c => c.statut === 'Approved').length, color: '#10B981' },
    { title: 'Rejected', value: conventions.filter(c => c.statut === 'Rejected').length, color: '#EF4444' }
  ];

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
            <button className="modal-close" onClick={closeAddModal} disabled={loading}>
              <i className="fas fa-times"></i>
            </button>
            
            <h2 className="modal-title">Add New Request</h2>
            
            {submitMessage && (
              <div className="alert alert-success">
                <i className="fas fa-check-circle"></i> {submitMessage}
              </div>
            )}
            
            {submitError && (
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle"></i> {submitError}
              </div>
            )}
            
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
                  disabled={loading}
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>
              
              <div className="form-group">
                <label>Convention Type</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={errors.type ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="" disabled>Select convention type</option>
                  <option value="Student Exchange">Student Exchange</option>
                  <option value="Double Degree">Double Degree</option>
                  <option value="Research">Research</option>
                  <option value="Training">Training</option>
                  <option value="Internship">Internship</option>
                  <option value="Relocation">Relocation</option>
                </select>
                {errors.type && <span className="error-text">{errors.type}</span>}
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
                  disabled={loading}
                ></textarea>
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>
              
              <div className="form-group">
                <label>Upload Documents</label>
                <div 
                  className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${errors.documents ? 'error' : ''}`}
                  onClick={!loading ? handleFileAreaClick : undefined}
                  onDragOver={!loading ? handleDragOver : undefined}
                  onDragLeave={!loading ? handleDragLeave : undefined}
                  onDrop={!loading ? handleDrop : undefined}
                  style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}
                >
                  <i className="fas fa-cloud-upload-alt"></i>
                  <p>Drag and drop files here or click to browse</p>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple 
                    style={{display: 'none'}} 
                    onChange={handleFileInputChange}
                    disabled={loading}
                  />
                </div>
                {errors.documents && <span className="error-text">{errors.documents}</span>}
                
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
                          disabled={loading}
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
              <button className="btn-close" onClick={closeAddModal} disabled={loading}>
                Cancel
              </button>
              <button className="btn-primary-modal" onClick={handleSubmitRequest} disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;