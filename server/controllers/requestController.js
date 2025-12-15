const Request = require('../models/Request');
const fs = require('fs');
const path = require('path');

// In-memory storage (replace with database later)
let requests = [];
let requestIdCounter = 1;

// Get all requests
const getAllRequests = (req, res) => {
  try {
    res.json({
      success: true,
      data: requests,
      count: requests.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get requests by teacher
const getRequestsByTeacher = (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacherRequests = requests.filter(r => r.teacherId == teacherId);
    
    res.json({
      success: true,
      data: teacherRequests,
      count: teacherRequests.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single request by ID
const getRequestById = (req, res) => {
  try {
    const { id } = req.params;
    const request = requests.find(r => r.id == id);
    
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }
    
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new request
const createRequest = (req, res) => {
  try {
    const { title, type, description, teacherId } = req.body;

    // Validation
    if (!title || !type || !description || !teacherId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, type, description, teacherId'
      });
    }

    // Handle file uploads
    let documents = [];
    if (req.files && req.files.length > 0) {
      documents = req.files.map(file => ({
        originalName: file.originalname,
        fileName: file.filename,
        path: file.path,
        size: file.size,
        uploadedAt: new Date()
      }));
    }

    // Create new request
    const newRequest = new Request(
      requestIdCounter++,
      title,
      type,
      description,
      teacherId,
      documents,
      'In Progress',
      new Date()
    );

    // Store in memory
    requests.push(newRequest);

    // Also save to localStorage via frontend (optional)
    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: newRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update request status
const updateRequestStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['In Progress', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const request = requests.find(r => r.id == id);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    request.status = status;
    request.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Request status updated successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete request
const deleteRequest = (req, res) => {
  try {
    const { id } = req.params;
    const index = requests.findIndex(r => r.id == id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    // Delete associated files
    const request = requests[index];
    if (request.documents && request.documents.length > 0) {
      request.documents.forEach(doc => {
        if (doc.path && fs.existsSync(doc.path)) {
          fs.unlinkSync(doc.path);
        }
      });
    }

    requests.splice(index, 1);

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Search requests
const searchRequests = (req, res) => {
  try {
    const { query, status, type } = req.query;
    
    let filtered = requests;

    if (query) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(r => r.status === status);
    }

    if (type) {
      filtered = filtered.filter(r => r.type === type);
    }

    res.json({
      success: true,
      data: filtered,
      count: filtered.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllRequests,
  getRequestsByTeacher,
  getRequestById,
  createRequest,
  updateRequestStatus,
  deleteRequest,
  searchRequests
};
