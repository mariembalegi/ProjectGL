# Quick Start Guide - Backend Teacher Request System

## 🚀 Your Backend is Ready!

### Server Status
✅ **Backend Server**: Running on `http://localhost:5000`  
✅ **Frontend**: Running on `http://localhost:3000`

### Start Backend Anytime
```bash
cd server
npm start
```

---

## 📝 How Teachers Submit Requests

### Teacher Flow:
1. Teacher fills out form in `Welcome.js`:
   - Title
   - Type (Research, Student Exchange, etc.)
   - Description
   - Upload documents (max 5 files)

2. Click "Submit Request" button

3. Frontend calls API:
   ```javascript
   await createRequest(formData, selectedFiles);
   ```

4. Backend stores request in database with:
   - Request ID
   - Teacher ID
   - Files in `/uploads/` folder
   - Status: "In Progress"
   - Timestamp

---

## 🔧 Integration Steps for Welcome.js

### 1. Import API Service
```javascript
import { createRequest, getAllRequests } from '../services/api';
```

### 2. Update handleSubmitRequest
```javascript
const handleSubmitRequest = async () => {
  if (!validateForm()) return;

  try {
    // Send to backend
    const result = await createRequest(formData, selectedFiles);
    
    // Update local state with response
    setConventions(prev => [result.data, ...prev]);
    
    // Show success message
    alert('Request submitted successfully!');
    
    // Close modal
    closeAddModal();
  } catch (error) {
    alert('Error submitting request: ' + error.message);
  }
};
```

### 3. Load Requests on Mount
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

---

## 📊 Admin Dashboard (DashboardAdmin.js) Features

### View All Requests
- List of all submitted requests
- Filter by status, type, teacher
- Sort by date

### Update Request Status
```javascript
import { updateRequestStatus } from '../services/api';

// Change status to "Approved"
await updateRequestStatus(requestId, 'Approved');
```

### Delete Requests
```javascript
import { deleteRequest } from '../services/api';

await deleteRequest(requestId);
```

---

## 📂 File Structure After Setup

```
ProjectGL/
├── server/
│   ├── server.js                      ← Main server
│   ├── package.json                   ← Dependencies
│   ├── .env                           ← Config (PORT=5000)
│   ├── routes/
│   │   ├── requests.js                ← /api/requests endpoints
│   │   └── auth.js                    ← /api/auth endpoints
│   ├── models/
│   │   └── Request.js                 ← Data model
│   ├── controllers/
│   │   └── requestController.js       ← Business logic
│   └── uploads/                       ← Uploaded files storage
│
├── frontend/
│   └── src/
│       ├── services/
│       │   └── api.js                 ← API client
│       └── components/
│           ├── Welcome.js             ← Teacher creates requests
│           └── DashboardAdmin.js      ← Admin views all requests
│
└── BACKEND_READY.md                  ← Full documentation
```

---

## 🧪 Test It Out

### Using Fetch (in browser console):
```javascript
// Get all requests
fetch('http://localhost:5000/api/requests')
  .then(r => r.json())
  .then(data => console.log(data));

// Create a request
const form = new FormData();
form.append('title', 'Test Request');
form.append('type', 'Research');
form.append('description', 'Testing the backend');
form.append('teacherId', '1');

fetch('http://localhost:5000/api/requests', {
  method: 'POST',
  body: form
})
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## 💾 Data Storage

### Currently: In-Memory
- ✅ Works perfectly for development
- ✅ Files are saved to disk (`/uploads/`)
- ❌ Requests disappear on server restart

### Future: MySQL Database
- Add persistent storage
- Track request history
- Generate reports

---

## 🔒 Security Features (Ready to Add)

1. **Authentication**: Verify teacher identity
2. **Authorization**: Check teacher can only access own requests
3. **File Validation**: Verify file types/sizes
4. **Rate Limiting**: Prevent spam requests
5. **CORS**: Only allow frontend origin (already configured)

---

## ⚡ Performance Tips

1. **Keep files organized**: Use `/uploads/{teacherId}/` structure
2. **Clean up old files**: Implement file cleanup routine
3. **Add pagination**: Limit requests returned per page
4. **Index database**: Add indexes on teacherId, status, date
5. **Cache responses**: Cache frequently accessed data

---

## 🎯 Next Session

When you continue development:

1. **Start backend first**:
   ```bash
   cd server && npm start
   ```

2. **Start frontend** (new terminal):
   ```bash
   cd frontend && npm start
   ```

3. **Work on components**:
   - Update `Welcome.js` to call create request API
   - Update `DashboardAdmin.js` to show all requests
   - Add request details view

---

## 📞 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 already in use | Kill process: `lsof -i :5000` then `kill -9 <PID>` |
| Backend not responding | Check server is running: `npm start` in `/server` |
| CORS errors | Frontend URL must match `cors` config in `server.js` |
| Files not uploading | Check `/uploads` folder permissions |
| Routes not loading | Check route files exist: `./routes/requests.js` |

---

## 📚 Key Files to Edit

- **[server/server.js](server/server.js)** - Add middleware, configure server
- **[server/routes/requests.js](server/routes/requests.js)** - Add new endpoints
- **[frontend/src/services/api.js](frontend/src/services/api.js)** - Update API calls
- **[frontend/src/components/Welcome.js](frontend/src/components/Welcome.js)** - Integrate request creation
- **[frontend/src/components/DashboardAdmin.js](frontend/src/components/DashboardAdmin.js)** - Show all requests

---

## ✅ Success Checklist

- [x] Backend server running on port 5000
- [x] Express.js configured with CORS
- [x] Request model created
- [x] CRUD endpoints implemented
- [x] File upload support added
- [x] API service created for frontend
- [x] Routes properly configured
- [x] Upload directory created
- [ ] Frontend integrated with API
- [ ] Database connected (optional)
- [ ] User authentication added (optional)
- [ ] Email notifications setup (optional)

---

You're all set! Start coding the frontend integration! 🚀
