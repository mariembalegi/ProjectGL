const { pool } = require('../db/connection');
const fs = require('fs');
const path = require('path');

// Get all requests
const getAllRequests = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [requests] = await connection.query(
      `SELECT r.*, GROUP_CONCAT(
        JSON_OBJECT(
          'id', d.id,
          'fileName', d.file_name,
          'originalName', d.file_name,
          'path', d.file_path,
          'size', d.file_size,
          'uploadedAt', d.uploaded_at
        )
      ) as documents FROM requests r 
      LEFT JOIN request_documents d ON r.id = d.request_id 
      GROUP BY r.id 
      ORDER BY r.created_at DESC`
    );

    // Parse documents JSON
    const formattedRequests = requests.map(req => ({
      ...req,
      documents: req.documents ? JSON.parse(`[${req.documents}]`) : []
    }));

    connection.release();
    
    res.json({
      success: true,
      data: formattedRequests,
      count: formattedRequests.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get requests by teacher
const getRequestsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const connection = await pool.getConnection();
    
    const [requests] = await connection.query(
      `SELECT r.*, GROUP_CONCAT(
        JSON_OBJECT(
          'id', d.id,
          'fileName', d.file_name,
          'originalName', d.file_name,
          'path', d.file_path,
          'size', d.file_size,
          'uploadedAt', d.uploaded_at
        )
      ) as documents FROM requests r 
      LEFT JOIN request_documents d ON r.id = d.request_id 
      WHERE r.teacher_id = ? 
      GROUP BY r.id 
      ORDER BY r.created_at DESC`,
      [teacherId]
    );

    // Parse documents JSON
    const formattedRequests = requests.map(req => ({
      ...req,
      documents: req.documents ? JSON.parse(`[${req.documents}]`) : []
    }));

    connection.release();
    
    res.json({
      success: true,
      data: formattedRequests,
      count: formattedRequests.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single request by ID
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const [requests] = await connection.query(
      `SELECT r.*, GROUP_CONCAT(
        JSON_OBJECT(
          'id', d.id,
          'fileName', d.file_name,
          'originalName', d.file_name,
          'path', d.file_path,
          'size', d.file_size,
          'uploadedAt', d.uploaded_at
        )
      ) as documents FROM requests r 
      LEFT JOIN request_documents d ON r.id = d.request_id 
      WHERE r.id = ? 
      GROUP BY r.id`,
      [id]
    );

    if (!requests || requests.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    const request = {
      ...requests[0],
      documents: requests[0].documents ? JSON.parse(`[${requests[0].documents}]`) : []
    };

    connection.release();
    
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new request
const createRequest = async (req, res) => {
  try {
    const { title, type, description, teacherId } = req.body;

    // Validation
    if (!title || !type || !description || !teacherId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, type, description, teacherId'
      });
    }

    const connection = await pool.getConnection();
    
    // Insert request
    const [result] = await connection.execute(
      `INSERT INTO requests (title, type, description, teacher_id, status) 
       VALUES (?, ?, ?, ?, 'In Progress')`,
      [title, type, description, teacherId]
    );

    const requestId = result.insertId;

    // Insert documents if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await connection.execute(
          `INSERT INTO request_documents (request_id, file_name, file_path, file_size) 
           VALUES (?, ?, ?, ?)`,
          [requestId, file.originalname, file.path, file.size]
        );
      }
    }

    // Fetch the created request with documents
    const [requests] = await connection.query(
      `SELECT r.*, GROUP_CONCAT(
        JSON_OBJECT(
          'id', d.id,
          'fileName', d.file_name,
          'originalName', d.file_name,
          'path', d.file_path,
          'size', d.file_size,
          'uploadedAt', d.uploaded_at
        )
      ) as documents FROM requests r 
      LEFT JOIN request_documents d ON r.id = d.request_id 
      WHERE r.id = ? 
      GROUP BY r.id`,
      [requestId]
    );

    const newRequest = {
      ...requests[0],
      documents: requests[0].documents ? JSON.parse(`[${requests[0].documents}]`) : []
    };

    connection.release();

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
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['In Progress', 'Approved', 'Rejected', 'To Modify'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      `UPDATE requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      connection.release();
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    // Fetch updated request
    const [requests] = await connection.query(
      `SELECT r.*, GROUP_CONCAT(
        JSON_OBJECT(
          'id', d.id,
          'fileName', d.file_name,
          'originalName', d.file_name,
          'path', d.file_path,
          'size', d.file_size,
          'uploadedAt', d.uploaded_at
        )
      ) as documents FROM requests r 
      LEFT JOIN request_documents d ON r.id = d.request_id 
      WHERE r.id = ? 
      GROUP BY r.id`,
      [id]
    );

    const updatedRequest = {
      ...requests[0],
      documents: requests[0].documents ? JSON.parse(`[${requests[0].documents}]`) : []
    };

    connection.release();

    res.json({
      success: true,
      message: 'Request status updated successfully',
      data: updatedRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete request
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    // Fetch request with documents to delete files
    const [requests] = await connection.query(
      `SELECT * FROM request_documents WHERE request_id = ?`,
      [id]
    );

    // Delete associated files from disk
    for (const doc of requests) {
      if (doc.file_path && fs.existsSync(doc.file_path)) {
        try {
          fs.unlinkSync(doc.file_path);
        } catch (err) {
          console.error(`Failed to delete file: ${doc.file_path}`, err);
        }
      }
    }

    // Delete from database (documents will be deleted by foreign key cascade)
    const [result] = await connection.execute(
      `DELETE FROM requests WHERE id = ?`,
      [id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Search requests
const searchRequests = async (req, res) => {
  try {
    const { query, status, type } = req.query;
    let sql = `SELECT r.*, GROUP_CONCAT(
      JSON_OBJECT(
        'id', d.id,
        'fileName', d.file_name,
        'originalName', d.file_name,
        'path', d.file_path,
        'size', d.file_size,
        'uploadedAt', d.uploaded_at
      )
    ) as documents FROM requests r 
    LEFT JOIN request_documents d ON r.id = d.request_id 
    WHERE 1=1`;
    
    const params = [];

    if (query) {
      sql += ` AND (r.title LIKE ? OR r.description LIKE ?)`;
      const searchQuery = `%${query}%`;
      params.push(searchQuery, searchQuery);
    }

    if (status) {
      sql += ` AND r.status = ?`;
      params.push(status);
    }

    if (type) {
      sql += ` AND r.type = ?`;
      params.push(type);
    }

    sql += ` GROUP BY r.id ORDER BY r.created_at DESC`;

    const connection = await pool.getConnection();
    const [requests] = await connection.query(sql, params);

    // Parse documents JSON
    const formattedRequests = requests.map(req => ({
      ...req,
      documents: req.documents ? JSON.parse(`[${req.documents}]`) : []
    }));

    connection.release();

    res.json({
      success: true,
      data: formattedRequests,
      count: formattedRequests.length
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
