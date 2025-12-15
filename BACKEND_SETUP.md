# Backend Setup for Teacher Requests

## Overview
This backend system handles storing and managing teacher (enseignant) paper requests. Teachers can create requests with documents, and these are stored in the backend.

## Project Structure

```
server/
├── server.js                 # Main server file
├── package.json             # Dependencies
├── .env                     # Environment variables
├── models/
│   └── Request.js           # Request data model
├── controllers/
│   └── requestController.js # Business logic for requests
├── routes/
│   ├── requests.js          # Request endpoints
│   └── auth.js              # Authentication endpoints
└── uploads/                 # Directory for uploaded files
```

## Getting Started

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Start the Backend Server
```bash
npm start
# Server will run on http://localhost:5000
```

### 3. API Endpoints

#### Create a Request
```
POST /api/requests
Content-Type: multipart/form-data

{
  "title": "Paper Request Title",
  "type": "Research",
  "description": "Paper description",
  "teacherId": "1",
  "documents": [file1, file2, ...]
}

Response:
{
  "success": true,
  "message": "Request created successfully",
  "data": {
    "id": 1,
    "title": "Paper Request Title",
    "type": "Research",
    "description": "Paper description",
    "teacherId": "1",
    "documents": [...],
    "status": "In Progress",
    "createdAt": "2025-12-15T...",
    "updatedAt": "2025-12-15T..."
  }
}
```

#### Get All Requests
```
GET /api/requests
Response: Array of all requests
```

#### Get Teacher's Requests
```
GET /api/requests/teacher/:teacherId
Response: Array of requests by specific teacher
```

#### Get Single Request
```
GET /api/requests/:id
Response: Single request details
```

#### Update Request Status
```
PATCH /api/requests/:id/status
Content-Type: application/json

{
  "status": "Approved" | "Rejected" | "In Progress"
}
```

#### Delete Request
```
DELETE /api/requests/:id
```

#### Search Requests
```
GET /api/requests/search?query=title&status=In Progress&type=Research
```

## Frontend Integration

### Import the API Service
```javascript
import { createRequest, getAllRequests, getTeacherRequests } from '../services/api';
```

### Create a Request Example
```javascript
const handleSubmitRequest = async () => {
  try {
    const result = await createRequest(formData, selectedFiles);
    console.log('Request created:', result);
    // Update UI accordingly
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Fetch Requests Example
```javascript
const fetchRequests = async () => {
  try {
    const result = await getAllRequests();
    setConventions(result.data); // Map to your state
  } catch (error) {
    console.error('Error fetching requests:', error);
  }
};
```

## File Upload Support
Supported file types:
- PDF (.pdf)
- Word documents (.doc, .docx)
- Excel spreadsheets (.xls, .xlsx)
- Text files (.txt)
- Images (.jpg, .png)

Maximum files per request: 5
Maximum file size: Configured in multer

## Error Handling
All responses follow this format:

Success:
```json
{
  "success": true,
  "data": {...}
}
```

Error:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Next Steps
1. Connect to MySQL database instead of in-memory storage
2. Add authentication middleware
3. Implement user role-based access control
4. Add logging and monitoring
5. Set up automated testing

## Environment Variables (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=convenia_db
```

Modify these variables based on your setup.
