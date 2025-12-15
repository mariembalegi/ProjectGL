// API service for communicating with backend
const API_BASE_URL = 'http://localhost:5000/api';

// Create a new request with documents
export const createRequest = async (formData, files) => {
  try {
    const formDataObj = new FormData();
    
    // Add form fields
    formDataObj.append('title', formData.title);
    formDataObj.append('type', formData.type);
    formDataObj.append('description', formData.description);
    formDataObj.append('teacherId', localStorage.getItem('userId') || '1'); // Get from auth
    
    // Add files
    if (files && files.length > 0) {
      files.forEach((file) => {
        formDataObj.append('documents', file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      body: formDataObj,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to create request');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

// Get all requests
export const getAllRequests = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch requests');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

// Get teacher's requests
export const getTeacherRequests = async (teacherId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests/teacher/${teacherId}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teacher requests');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching teacher requests:', error);
    throw error;
  }
};

// Get single request
export const getRequest = async (requestId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch request');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching request:', error);
    throw error;
  }
};

// Update request status
export const updateRequestStatus = async (requestId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to update request status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating request status:', error);
    throw error;
  }
};

// Delete request
export const deleteRequest = async (requestId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to delete request');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting request:', error);
    throw error;
  }
};

// Search requests
export const searchRequests = async (query, status = null, type = null) => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (status) params.append('status', status);
    if (type) params.append('type', type);

    const response = await fetch(`${API_BASE_URL}/requests/search?${params.toString()}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to search requests');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching requests:', error);
    throw error;
  }
};
