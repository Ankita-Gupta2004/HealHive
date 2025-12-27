# Integration & Testing Guide - HealHive Doctor Search Flow

## 🚀 Quick Start

### Prerequisites
1. Ensure all files are created:
   - `frontend/src/pateint form/DoctorSearch.jsx`
   - `frontend/src/pateint form/DoctorProfile.jsx`
   - `frontend/src/pateint form/ConsultationPayment.jsx`
   - `frontend/src/chat/pages/CallRoom.jsx`
   - `frontend/src/pateint form/AppointmentHistory.jsx`

2. Routes added to `frontend/src/main.jsx`:
   - `/doctor-search` → DoctorSearch
   - `/doctor-profile/:doctorId` → DoctorProfile
   - `/consultation-payment/:doctorId` → ConsultationPayment
   - `/call-room/:consultationId` → CallRoom
   - `/appointment-history` → AppointmentHistory

3. Navbar updated with links to doctor search and appointment history

---

## 🧪 Testing Workflow

### Test Case 1: Doctor Discovery
```
1. Login as patient or navigate to /doctor-search
2. Expected: See list of 6 mock doctors
3. Try search: Type "cardiology" → Should filter doctors
4. Try filters: Select "Cardiology" specialty → 1 doctor visible
5. Try rating filter: Drag to 4+ stars → Shows filtered doctors
6. Click "View Profile" on any doctor → Should navigate to /doctor-profile/:id
```

### Test Case 2: Doctor Profile & Booking
```
1. Navigate to /doctor-profile/1
2. Expected: See full doctor profile with:
   - Avatar, name, specialty, rating, online status
   - About section, education, achievements
   - Languages spoken
   - Time slot selection
3. Select any green (available) time slot
4. Click "Continue to Payment"
5. Expected: Navigate to /consultation-payment/1 with:
   - Doctor data and selected slot in route state
   - Payment form showing doctor info and fee
```

### Test Case 3: Payment Processing
```
1. On payment page, verify summary shows:
   - Doctor name and specialty
   - Selected date & time
   - Consultation fee and GST breakdown
2. Select payment method (Card/UPI/Wallet)
3. Fill form:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: 98765 43210
   - Card: 1234 5678 9012 3456 (if card selected)
   - Expiry: 12/25
   - CVV: 123
4. Click "Pay ₹[amount]"
5. Expected: 
   - Shows "Processing Payment..." with spinner
   - After 3 seconds: Success message
   - Auto-redirect to /call-room/[consultationId]
```

### Test Case 4: Consultation Call Room
```
1. On call room page, verify:
   - Consultation ID displayed at top
   - Copy button works
   - Doctor info card showing
2. Click "Start Chat" button
3. Expected:
   - Call status changes to "calling"
   - After 3 seconds: "connected"
   - Chat sidebar appears with message history
4. Type message and send:
   - Message appears in chat
   - Mock doctor response after 1.5 seconds
5. Test call duration:
   - Timer starts and counts
   - Displayed as MM:SS format
6. End call:
   - Click red phone button
   - Call status changes to "ended"
   - Chat input disabled
```

### Test Case 5: Appointment History
```
1. Navigate to /appointment-history (via Navbar → My Appointments)
2. Click "Upcoming" tab:
   - Should show 2 upcoming appointments
   - Doctor info, date, time visible
   - "Join Call" button functional
3. Click "Completed" tab:
   - Should show 3 completed consultations
   - Rating and feedback visible
   - Prescription details (medicines, follow-up)
   - "Download" and "Share" buttons
4. Click "Book Another Consultation":
   - Should navigate to /doctor-search
```

---

## 🔧 Component Connection Verification

### DoctorSearch → DoctorProfile
✅ **Verified Connection:**
```javascript
// DoctorSearch.jsx (onClick handler)
navigate(`/doctor-profile/${doctor.id}`, { state: { doctor } })

// DoctorProfile.jsx (receives state)
const { doctor } = location.state || {}
const mockDoctor = doctor || { id: doctorId, ... }
```

### DoctorProfile → ConsultationPayment
✅ **Verified Connection:**
```javascript
// DoctorProfile.jsx (onClick handler)
navigate(`/consultation-payment/${doctor.id}`, {
  state: { doctor, selectedSlot }
})

// ConsultationPayment.jsx (receives state)
const { doctor, selectedSlot } = location.state || {}
```

### ConsultationPayment → CallRoom
✅ **Verified Connection:**
```javascript
// ConsultationPayment.jsx (on payment success)
navigate(`/call-room/${data.consultationId}`, {
  state: { doctor, slot, paid: true }
})

// CallRoom.jsx (receives state)
const { doctor, slot, paid } = location.state || {}
```

---

## 📱 Responsive Design Testing

### Desktop (1920px+)
- ✅ 3-column layout for all pages
- ✅ Side-by-side doctor cards in grid
- ✅ Payment form and summary visible together
- ✅ Call room video + chat sidebar visible

### Tablet (768px - 1023px)
- ✅ 2-column grid for doctors
- ✅ Stacked payment form and summary
- ✅ Call room video spans full width, chat below
- ✅ Navbar collapses to mobile menu

### Mobile (320px - 767px)
- ✅ Single-column layout everywhere
- ✅ Full-width cards
- ✅ Hamburger menu for navigation
- ✅ Touch-friendly button sizes

---

## 🎨 Visual Testing Checklist

### Colors & Gradients
- ✅ Emerald/teal gradient on buttons
- ✅ White cards with emerald borders
- ✅ Doctor online status = green dot
- ✅ Rating stars = yellow when filled
- ✅ Status badges: green (completed), emerald (confirmed), blue (scheduled)

### Icons
- ✅ Lucide-react icons imported correctly
- ✅ Icons sized appropriately (h-4 w-4 for small, h-6 w-6 for medium)
- ✅ Icon colors match theme (text-emerald-600, text-teal-600)

### Animations
- ✅ Buttons scale on hover (hover:scale-[1.02])
- ✅ Fade-in animations on page load
- ✅ Spinner animation during payment processing
- ✅ Pulse animation on call waiting status

---

## 🔍 State Management Testing

### DoctorSearch State
```javascript
✅ searchQuery updates correctly
✅ selectedSpecialty filters doctors
✅ selectedRating filters by minimum
✅ useMemo doesn't re-filter unnecessarily
```

### DoctorProfile State
```javascript
✅ selectedSlot changes on click
✅ Booked slots remain gray
✅ Available slots turn green when selected
```

### ConsultationPayment State
```javascript
✅ Form data updates on input change
✅ Card number formats with spaces
✅ Expiry date formats as MM/YY
✅ CVV accepts only numbers (max 4)
✅ Payment method selection switches UI
✅ paymentStatus progresses: null → processing → success/failed
```

### CallRoom State
```javascript
✅ callStatus transitions: waiting → calling → connected → ended
✅ callType set to chat/voice/video
✅ callDuration increments every second
✅ isMicOn and isVideoOn toggle correctly
✅ messages array appends new messages
```

---

## 🌐 Backend Integration Checklist

### Existing Endpoints (Should Work)
- ✅ `POST /api/users/login` - Fetch user role
- ✅ `POST /api/patient/submit` - Save patient form
- ✅ `POST /api/doctor/submit` - Register doctor
- ✅ `GET /api/doctor/profile` - Fetch doctor profile

### Mock Endpoints (Currently Simulated)
- ⚠️ `POST /api/payments/initiate` - Currently returns mock consultationId
- ⚠️ Consultation data - Using mock data, needs Consultation model

### Future Backend Setup
```javascript
// Add to backend/models/Consultation.js
const ConsultationSchema = new mongoose.Schema({
  patientId: String,
  doctorId: Number,
  slotTime: Date,
  consultationType: String,
  status: String,
  paymentStatus: String,
  chatMessages: [{
    sender: String,
    text: String,
    timestamp: Date
  }],
  prescription: Object,
  rating: Number,
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

// Add routes to backend/routes/Consultation.js
router.post('/create', verifyToken, createConsultation);
router.get('/:id', verifyToken, getConsultation);
router.put('/:id', verifyToken, updateConsultation);
```

---

## 🐛 Troubleshooting

### Issue: Doctor cards not displaying
```
Solution: Verify doctorFilterService.js is in frontend/src/utils/
Check: import { getAllDoctors } from "../utils/doctorFilterService"
```

### Issue: Navigation not working
```
Solution: Ensure all routes are added to main.jsx
Check: import DoctorSearch from "./pateint form/DoctorSearch.jsx"
```

### Issue: Payment form not submitting
```
Solution: Check form validation - all fields required
Check: formData has fullName, email, phone, and payment method details
```

### Issue: Chat messages not appearing
```
Solution: Check messages array state update
Solution: Verify useRef for scroll to bottom is targeting correct div
```

### Issue: Call timer not incrementing
```
Solution: Verify callStatus === "connected"
Check: useEffect cleanup clears interval on unmount
```

---

## ✅ Production Readiness Checklist

### Code Quality
- [ ] No console errors or warnings
- [ ] All imports resolve correctly
- [ ] No unused imports
- [ ] Proper error handling on all API calls
- [ ] Loading states for async operations

### Security
- [ ] Firebase token sent with all API calls
- [ ] No sensitive data in local state (only in localStorage with caution)
- [ ] Payment form uses HTTPS
- [ ] CORS headers configured on backend

### Performance
- [ ] useMemo for expensive filters
- [ ] useCallback for event handlers (if needed)
- [ ] Images lazy-loaded
- [ ] No unnecessary re-renders
- [ ] Bundle size acceptable

### Accessibility
- [ ] Alt text on images/avatars
- [ ] ARIA labels on buttons
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG standards
- [ ] Form labels properly associated

### Testing
- [ ] All user flows work end-to-end
- [ ] Responsive design verified
- [ ] Error states handled
- [ ] Empty states display properly
- [ ] Cross-browser compatibility tested

---

## 📊 Performance Metrics

### Page Load Times (Target)
- Doctor Search: < 1s
- Doctor Profile: < 500ms
- Payment Page: < 1s
- Call Room: < 1.5s
- Appointment History: < 1s

### Bundle Size (Estimated)
- DoctorSearch.jsx: ~12 KB
- DoctorProfile.jsx: ~15 KB
- ConsultationPayment.jsx: ~18 KB
- CallRoom.jsx: ~20 KB
- AppointmentHistory.jsx: ~16 KB
- Total Components: ~81 KB (gzipped: ~20 KB)

---

## 🎓 Learning Resources

- React Hooks: useState, useRef, useEffect, useMemo
- React Router: useNavigate, useParams, useLocation
- Tailwind CSS: Responsive design, animations
- Lucide Icons: Icon integration
- Firebase Auth: Token-based authentication

---

## 📞 Support & Feedback

Report issues or request features:
1. Check troubleshooting section above
2. Review component documentation in DOCTOR_SEARCH_GUIDE.md
3. Check browser console for error messages
4. Verify all files are created and routes are configured

---

**Test Status:** Ready for QA
**Last Updated:** January 2024
