# HealHive Doctor Search - Quick Reference Card

## 📍 File Locations & Imports

### Components
```javascript
// Search & Discovery
import DoctorSearch from "./pateint form/DoctorSearch.jsx"
import DoctorProfile from "./pateint form/DoctorProfile.jsx"

// Booking & Payment
import ConsultationPayment from "./pateint form/ConsultationPayment.jsx"

// Consultation & History
import CallRoom from "./chat/pages/CallRoom.jsx"
import AppointmentHistory from "./pateint form/AppointmentHistory.jsx"

// Utilities
import { 
  getAllDoctors, 
  getDoctorById, 
  getDoctorsBySpecialty, 
  findSpecialtyForDisease, 
  filterDoctors 
} from "./utils/doctorFilterService.js"
```

### Routes in main.jsx
```javascript
<Route path="/doctor-search" element={<DoctorSearch />} />
<Route path="/doctor-profile/:doctorId" element={<DoctorProfile />} />
<Route path="/consultation-payment/:doctorId" element={<ConsultationPayment />} />
<Route path="/call-room/:consultationId" element={<CallRoom />} />
<Route path="/appointment-history" element={<AppointmentHistory />} />
```

---

## 🎯 Key Props & State Variables

### DoctorSearch
```javascript
// State
const [searchQuery, setSearchQuery] = useState("")
const [selectedSpecialty, setSelectedSpecialty] = useState(null)
const [selectedRating, setSelectedRating] = useState(0)

// Filtering (useMemo)
const filteredDoctors = useMemo(() => {
  return getAllDoctors().filter(doctor => 
    (searchQuery === "" || 
     doctor.name.toLowerCase().includes(searchQuery) ||
     doctor.specialty.toLowerCase().includes(searchQuery) ||
     doctor.diseases.some(d => d.toLowerCase().includes(searchQuery))) &&
    (!selectedSpecialty || doctor.specialty === selectedSpecialty) &&
    (!selectedRating || doctor.rating >= selectedRating)
  )
}, [searchQuery, selectedSpecialty, selectedRating])

// Navigation
navigate(`/doctor-profile/${doctor.id}`, { state: { doctor } })
```

### DoctorProfile
```javascript
// Receive data
const { doctorId } = useParams()
const { doctor } = location.state || {}
const mockDoctor = doctor || getDoctorById(doctorId)

// State
const [selectedSlot, setSelectedSlot] = useState(null)

// Navigate to payment
const handleBookConsultation = () => {
  if (!selectedSlot) return alert("Please select a time slot")
  navigate(`/consultation-payment/${mockDoctor.id}`, {
    state: { doctor: mockDoctor, selectedSlot }
  })
}
```

### ConsultationPayment
```javascript
// Receive data
const { doctor, selectedSlot } = location.state || {}
const { doctorId } = useParams()

// State
const [paymentMethod, setPaymentMethod] = useState("card")
const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  phone: "",
  cardNumber: "",
  expiryDate: "",
  cvv: ""
})
const [paymentStatus, setPaymentStatus] = useState(null) // null|processing|success|failed

// Handle payment
const handlePayment = async (e) => {
  e.preventDefault()
  setPaymentStatus("processing")
  
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/payments/initiate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ /* payment data */ })
      }
    )
    
    if (response.ok) {
      const data = await response.json()
      setPaymentStatus("success")
      setTimeout(() => {
        navigate(`/call-room/${data.consultationId}`, {
          state: { doctor, slot: selectedSlot, paid: true }
        })
      }, 2000)
    } else {
      setPaymentStatus("failed")
    }
  } catch (error) {
    setPaymentStatus("failed")
  }
}
```

### CallRoom
```javascript
// Receive data
const { consultationId } = useParams()
const { doctor, slot, paid } = location.state || {}

// State
const [callStatus, setCallStatus] = useState("waiting") // waiting|calling|connected|ended
const [callType, setCallType] = useState(null) // chat|voice|video
const [messages, setMessages] = useState([...])
const [messageInput, setMessageInput] = useState("")
const [isMicOn, setIsMicOn] = useState(true)
const [isVideoOn, setIsVideoOn] = useState(true)
const [callDuration, setCallDuration] = useState(0)

// Start call
const startCall = (type) => {
  setCallType(type)
  setCallStatus("calling")
  setTimeout(() => setCallStatus("connected"), 3000)
}

// End call
const endCall = () => {
  setCallStatus("ended")
  setCallType(null)
}

// Send message
const handleSendMessage = () => {
  if (messageInput.trim()) {
    setMessages([...messages, {
      id: messages.length + 1,
      sender: "patient",
      text: messageInput,
      timestamp: new Date()
    }])
    setMessageInput("")
    
    // Mock doctor response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: "doctor",
        text: "Mock doctor response...",
        timestamp: new Date()
      }])
    }, 1500)
  }
}
```

### AppointmentHistory
```javascript
// State
const [activeTab, setActiveTab] = useState("upcoming") // upcoming|completed

// Mock data
const upcomingAppointments = [...]
const completedAppointments = [...]

// Display logic
const currentAppointments = 
  activeTab === "upcoming" 
    ? upcomingAppointments 
    : completedAppointments

// Navigate to join call
navigate(`/call-room/${appointment.id}`, { state: { appointment } })
```

---

## 🎨 Common Styling Patterns

### Gradient Button (Primary)
```jsx
<button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition font-semibold">
  Action
</button>
```

### Card Layout
```jsx
<div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
  {/* Content */}
</div>
```

### Status Badge
```jsx
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
  <span className="h-2 w-2 rounded-full bg-emerald-600" />
  Online
</span>
```

### Grid Layout (Responsive)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

### Input Field
```jsx
<input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className="w-full px-4 py-2.5 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
  placeholder="Placeholder text"
/>
```

### Loading Spinner
```jsx
{isLoading && (
  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
)}
```

---

## 🔄 API Integration Checklist

### Payment Endpoint
```javascript
// Request
POST /api/payments/initiate
{
  doctorId: Number,
  doctorName: String,
  consultationFee: Number,
  selectedSlot: String,
  patientName: String,
  patientEmail: String,
  paymentMethod: String // "card"|"upi"|"wallet"
}

// Response
{
  consultationId: String,
  paymentId: String,
  status: "success" | "failed"
}
```

### Future Consultation Endpoints
```javascript
// Create consultation
POST /api/consultations
{
  patientId: String,
  doctorId: Number,
  slotTime: Date,
  consultationType: String,
  paymentStatus: String
}

// Get consultations
GET /api/consultations
Response: [consultation, ...]

// Get single consultation
GET /api/consultations/:id

// Send message (future WebSocket)
POST /api/messages
{
  consultationId: String,
  sender: String,
  text: String
}

// Rate consultation
POST /api/consultations/:id/rate
{
  rating: Number,
  feedback: String
}
```

---

## 🧪 Common Test Cases

### Test 1: Doctor Discovery
```
1. Navigate to /doctor-search
2. Type "Cardiology" in search
3. Verify: Only cardiology doctors show
4. Select rating filter ≥ 4
5. Verify: Doctors ≥ 4 rating show
6. Click "View Profile" on doctor
7. Verify: Navigate to /doctor-profile/:id with doctor state
```

### Test 2: Time Slot Selection
```
1. On doctor profile
2. Click on green (available) slot
3. Verify: Slot highlights/gets selected
4. Selected slot displays below calendar
5. Click "Continue to Payment"
6. Verify: Navigate to payment page with selected slot in state
```

### Test 3: Payment Form
```
1. Fill all form fields
2. Select payment method
3. Click "Pay ₹[amount]"
4. Verify: Shows "Processing..." with spinner
5. Wait 3 seconds
6. Verify: Shows success message
7. Auto-redirect to call room after 2 seconds
```

### Test 4: Call Types
```
1. On call room waiting state
2. Click "Start Chat"
3. Verify: Changes to "calling" state
4. Verify: After 3s, changes to "connected"
5. Type message and send
6. Verify: Message appears in chat
7. Verify: Mock doctor response appears
8. Repeat with "Voice Call" and "Video Call"
```

### Test 5: Appointment History
```
1. Navigate to /appointment-history
2. Verify: Upcoming tab shows 2 appointments
3. Click "Completed" tab
4. Verify: Shows 3 completed appointments
5. Verify: Prescriptions visible with medicines and follow-up
6. Click "Join Call" on upcoming appointment
7. Verify: Navigate to /call-room/:id
8. Click "Book Another" on completed
9. Verify: Navigate to /doctor-search
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Doctor cards not showing | Verify doctorFilterService.js exists with doctor data |
| Navigation not working | Check all routes added to main.jsx with correct imports |
| Payment form not submitting | Ensure all required fields filled (fullName, email, phone) |
| Chat messages not appearing | Check messages state update and scroll ref targeting |
| Call timer not incrementing | Verify callStatus === "connected" before incrementing |
| Doctor profile not loading | Check route state being passed with doctor object |
| Images not displaying | Verify lucide-react icons imported correctly |
| Styles not applying | Check Tailwind CSS configured in vite.config.js |

---

## 📦 Dependencies

### Already Installed
- `react-router-dom` - Navigation
- `lucide-react` - Icons
- `firebase` - Authentication
- `tailwindcss` - Styling

### May Need for Future
- `agora-rtc-react` - Video calls
- `stripe-js` - Payment gateway
- `socket.io-client` - Real-time communication
- `date-fns` - Date formatting

---

## 🚀 Performance Tips

1. **Use useMemo for filtering**: Prevents unnecessary re-renders when filtering doctors
2. **Lazy load images**: Use `loading="lazy"` on avatars
3. **Memoize callbacks**: Use `useCallback` if passing functions as props
4. **Split large components**: Break into smaller sub-components
5. **Optimize state**: Keep state local, only pass necessary props

---

## 📱 Responsive Breakpoints

```css
Mobile:  320px - 767px   (grid-cols-1)
Tablet:  768px - 1023px  (grid-cols-2)
Desktop: 1024px+         (grid-cols-3)
```

---

## 🎓 Component Complexity

| Component | Complexity | Size |
|-----------|-----------|------|
| DoctorSearch | Medium | ~250 lines |
| DoctorProfile | Medium | ~350 lines |
| ConsultationPayment | High | ~400 lines |
| CallRoom | High | ~450 lines |
| AppointmentHistory | Medium | ~380 lines |

---

## ✅ Pre-deployment Checklist

- [ ] All components created and imported
- [ ] All routes added to main.jsx
- [ ] API endpoints mocked or connected
- [ ] Navbar updated with new links
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Form validation working
- [ ] Error states handled
- [ ] Loading states implemented
- [ ] No console errors
- [ ] Browser compatibility checked

---

**Quick Links:**
- 📖 [Full Documentation](./DOCTOR_SEARCH_GUIDE.md)
- 🧪 [Testing Guide](./TESTING_GUIDE.md)
- 📊 [User Flow Diagram](./USER_FLOW_DIAGRAM.md)
- 🗂️ [Project Structure](./README.md)

---

**Last Updated:** January 2024
**Version:** 1.0
