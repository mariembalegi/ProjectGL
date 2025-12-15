# Testing Guide - Frontend & Backend Integration

## ✅ Current Status

Both servers are running:
- **Frontend**: http://localhost:3000 (React App)
- **Backend**: http://localhost:5000 (Express API)

---

## 🧪 Quick Test: Create a Request

### Manual Browser Test

1. **Open Frontend**
   - Go to: http://localhost:3000
   - Login (use any credentials)

2. **Click Add Button**
   - Look for the "+" button in the top right
   - Click it to open "Add New Request" modal

3. **Fill Out Form**
   ```
   Title: "Research Collaboration"
   Type: "Research"
   Description: "Need to collaborate with MIT on AI research"
   Files: Upload any PDF or document
   ```

4. **Submit**
   - Click "Submit Request" button
   - Wait for the green success message
   - See request appear at the top of the table

---

## 🔍 Check Backend Responses

### 1. Health Check
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"Server is running"}
```

### 2. Get All Requests
```bash
curl http://localhost:5000/api/requests
# Should return: {"success":true,"data":[...],"count":0}
```

### 3. Create a Request with curl
```bash
curl -X POST http://localhost:5000/api/requests \
  -F "title=Test Request" \
  -F "type=Research" \
  -F "description=Testing the API" \
  -F "teacherId=1" \
  -F "documents=@file.pdf"
```

---

## 📊 Expected Behavior

### Page Load
```
1. Opens Welcome component
2. useEffect calls GET /api/requests
3. Table fills with any existing requests
4. If no requests → Empty table (that's normal)
```

### Submit Request
```
1. Fill form with valid data
2. Click "Submit Request"
3. Button shows "Submitting..." with spinner
4. POST sent to /api/requests with FormData (including files)
5. Backend returns new request object
6. Green success message appears
7. New request added to table
8. Modal closes after 1.5 seconds
9. Form resets
```

### Errors
```
If form invalid:
- Show red error text under field
- Don't submit

If backend error:
- Show red error message at top of modal
- Keep modal open for retry
```

---

## 🐛 Debug Mode: Browser Console

Open DevTools (F12) and run:

### Check API Service
```javascript
import * as api from './services/api';
console.log('API Service:', api);

// Try to fetch requests
api.getAllRequests()
  .then(data => console.log('Requests:', data))
  .catch(err => console.error('Error:', err));
```

### Monitor Requests
```javascript
// Before submitting, open Network tab in DevTools
// Watch for:
// 1. POST /api/requests (with file data)
// 2. Response should have: {success: true, data: {...}}
```

### Check Loading State
```javascript
// Look for button changes:
// - Disabled when loading
// - Shows spinner icon
// - Text changes to "Submitting..."
```

---

## 📁 Check File Uploads

### View Uploaded Files
```bash
ls -la server/uploads/
# You should see files like: 1734276543210-123456789.pdf
```

### Check File Info in Backend
Open backend terminal and look for file details in request data.

---

## 🚨 Common Issues & Fixes

### Issue: "Cannot GET /api/requests"
**Cause**: Backend not running
**Fix**: 
```bash
cd server
npm start
```

### Issue: "Network request failed"
**Cause**: CORS issue or frontend can't reach backend
**Fix**: 
- Verify backend is on http://localhost:5000
- Check server.js CORS config allows http://localhost:3000

### Issue: Form validation shows errors
**Cause**: Missing required fields
**Fix**: Fill all fields including at least one file

### Issue: Requests disappear after page refresh
**Cause**: Data is in-memory (not in database)
**Fix**: That's normal for development. Restart server to clear.

### Issue: File upload doesn't work
**Cause**: File type not supported
**Fix**: Use PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, or PNG

---

## 📋 Test Checklist

Run through these to verify everything works:

### Backend
- [ ] Backend server starts without errors
- [ ] `GET /api/health` returns status
- [ ] `GET /api/requests` returns empty array initially
- [ ] Server listens on port 5000

### Frontend
- [ ] Frontend compiles without errors
- [ ] Page loads at http://localhost:3000
- [ ] Table loads (empty initially)
- [ ] Add request button works (opens modal)

### Form Validation
- [ ] Empty title shows error
- [ ] Empty type shows error
- [ ] Empty description shows error
- [ ] No files shows error
- [ ] All filled shows no errors

### Submission
- [ ] Click submit sends POST request
- [ ] Network tab shows POST /api/requests
- [ ] Button shows loading state
- [ ] Success message appears
- [ ] Modal closes after delay
- [ ] Form resets
- [ ] New request appears in table

### File Handling
- [ ] Can select files with file picker
- [ ] Can drag & drop files
- [ ] Files show in list
- [ ] Can remove individual files
- [ ] Files are sent to backend

---

## 📊 What Each Endpoint Does

### POST /api/requests
**Creates new request with files**
- Input: FormData with title, type, description, teacherId, documents
- Output: New request object with ID
- Files: Saved to `/server/uploads/`

### GET /api/requests
**Retrieves all requests**
- Input: None
- Output: Array of all requests
- Use: Load requests on page load

### GET /api/requests/teacher/:teacherId
**Get requests for specific teacher**
- Input: teacherId in URL
- Output: Array of that teacher's requests

### PATCH /api/requests/:id/status
**Update request status**
- Input: Request ID in URL, status in body
- Output: Updated request object
- Statuses: "In Progress", "Approved", "Rejected"

### DELETE /api/requests/:id
**Delete a request**
- Input: Request ID in URL
- Output: Success message

---

## 🎯 Full Test Scenario

1. **Start Servers**
   ```bash
   # Terminal 1
   cd server && npm start
   
   # Terminal 2
   cd frontend && npm start
   ```

2. **Open Browser**
   - Go to http://localhost:3000
   - Login with any credentials

3. **Create First Request**
   - Title: "Department Meeting"
   - Type: "Training"
   - Description: "Annual department sync"
   - Upload: Any PDF file
   - Submit

4. **Verify Success**
   - Green success message appears
   - Request shows in table
   - Status is "In Progress"
   - Date is today's date

5. **Create Second Request**
   - Title: "Research Proposal"
   - Type: "Research"
   - Description: "Submit new AI project proposal"
   - Upload: Different file
   - Submit

6. **Verify Table**
   - Two requests in table
   - Most recent first
   - Both show correct info
   - Can view details

7. **Refresh Page**
   - Hit F5 to reload
   - Requests reload from backend
   - Both still visible

---

## 💡 Tips

- **Clear browser cache** if you see old data: Ctrl+Shift+Delete
- **Check Network tab** if something doesn't work: Press F12
- **Look at server logs** for backend errors
- **Use Postman** to test API directly
- **Check /server/uploads/** to see uploaded files

---

## 🎉 Success!

If all tests pass, your integration is working perfectly!

Next steps:
1. Update DashboardAdmin to show all requests
2. Add ability to update request status
3. Connect to MySQL database for persistence
4. Add authentication integration

---

You're ready to test! 🚀
