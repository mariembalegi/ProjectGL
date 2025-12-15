# Backend Teacher Request System - Setup Complete ✅

## What's Been Set Up

Your backend is now ready to handle teacher (enseignant) requests with document uploads!

### Backend Server
- **Status**: Running on `http://localhost:5000`
- **Main Files**:
  - `server/server.js` - Express.js server with routes and middleware
  - `server/routes/requests.js` - Request CRUD endpoints
  - `server/models/Request.js` - Request data model
  - `server/controllers/requestController.js` - Business logic
  - `server/uploads/` - Directory for storing uploaded documents

### API Endpoints Available

#### 1. **Create a Request** (Teacher submits a paper request)
```
POST /api/requests
Content-Type: multipart/form-data

Body:
{
  "title": "Request Title",
  "type": "Research|Student Exchange|Double Degree|etc",
  "description": "Detailed description",
  "teacherId": "1",
  "documents": [file1, file2, ...] (max 5 files)
}

Response:
{
  "success": true,
  "message": "Request created successfully",
  "data": {
    "id": 1,
    "title": "Request Title",
    "status": "In Progress",
    "createdAt": "2025-12-15T...",
    ...
  }
}
```

#### 2. **Get All Requests**
```
GET /api/requests
Response: Array of all requests
```

#### 3. **Get Teacher's Requests**
```
GET /api/requests/teacher/:teacherId
Response: Array of requests by specific teacher
```

#### 4. **Get Single Request**
```
GET /api/requests/:id
Response: Single request with all details
```

#### 5. **Update Request Status**
```
PATCH /api/requests/:id/status
Body: { "status": "Approved" | "Rejected" | "In Progress" }
```

#### 6. **Delete Request**
```
DELETE /api/requests/:id
```

#### 7. **Search Requests**
```
GET /api/requests/search?query=keyword&status=In Progress&type=Research
```

#### 8. **Health Check**
```
GET /api/health
Response: { "status": "Server is running" }
```

## Frontend Integration

### Import the API Service
```javascript
import { 
  createRequest, 
  getAllRequests, 
  getTeacherRequests,
  updateRequestStatus,
  deleteRequest
} from '../services/api';
```

### Example: Submit a Request
```javascript
const handleSubmitRequest = async () => {
  try {
    const result = await createRequest(formData, selectedFiles);
    console.log('Request created:', result.data);
    // Update UI, show success message, etc.
  } catch (error) {
    console.error('Error:', error);
    // Show error to user
  }
};
```

### Example: Load All Requests
```javascript
useEffect(() => {
  const loadRequests = async () => {
    try {
      const result = await getAllRequests();
      setConventions(result.data);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };
  loadRequests();
}, []);
```

## Supported File Types
- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)
- Text (.txt)
- Images (.jpg, .png)

**Max files per request**: 5
**Files are stored in**: `server/uploads/`

## Current Storage
The system currently uses **in-memory storage**, which means:
- ✅ Requests work perfectly during development
- ❌ Data is lost when server restarts
- ⚠️ Not suitable for production

## Next Steps (Optional Improvements)

### 1. **Add Database Persistence**
Replace in-memory storage with MySQL:
```bash
npm install mysql2 sequelize
```

### 2. **Add Authentication**
Verify teacher identity before creating requests:
```javascript
// In routes/requests.js
app.post('/', authMiddleware, uploadHandler, createRequest);
```

### 3. **Add Status Notifications**
Email teachers when request status changes.

### 4. **Add Request Validation**
More strict validation on document types, sizes, etc.

### 5. **Add Logging**
Track all requests and actions for auditing.

## Running the Backend

### Option 1: Using npm
```bash
cd server
npm start
```

### Option 2: Using node directly
```bash
node server/server.js
```

### Option 3: Using nodemon for development
```bash
npm install -D nodemon
nodemon server/server.js
```

## Current Branch
You're on the **`backend`** branch - great for keeping backend work separate from frontend!

## File Structure
```
ProjectGL/
├── frontend/               # React frontend (port 3000)
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   │   └── api.js     # ← API communication service
│   │   └── ...
│   └── ...
│
└── server/                # Express backend (port 5000)
    ├── server.js          # Main entry point
    ├── package.json
    ├── .env               # Configuration
    ├── models/
    │   └── Request.js
    ├── controllers/
    │   └── requestController.js
    ├── routes/
    │   ├── requests.js
    │   ├── auth.js
    │   └── ...
    ├── uploads/           # Uploaded files storage
    └── node_modules/
```

## Testing the API

You can test using curl or Postman:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Create a request (with files)
curl -X POST http://localhost:5000/api/requests \
  -F "title=New Request" \
  -F "type=Research" \
  -F "description=Paper request description" \
  -F "teacherId=1" \
  -F "documents=@file1.pdf" \
  -F "documents=@file2.pdf"

# Get all requests
curl http://localhost:5000/api/requests

# Get teacher's requests
curl http://localhost:5000/api/requests/teacher/1
```

## Congratulations! 🎉

Your backend is ready to:
✅ Accept teacher paper requests
✅ Store request information
✅ Manage uploaded documents
✅ Provide request status tracking
✅ Serve requests to your frontend

Now you can connect your frontend (Welcome.js, DashboardAdmin.js) to use these API endpoints!
