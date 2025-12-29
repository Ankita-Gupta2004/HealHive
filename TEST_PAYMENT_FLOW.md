# Debug Payment Flow - Doctor Dashboard Issue

## Issue
Doctor dashboard showing no patients despite payments being made.

## Root Cause Analysis

### 1. **Check if doctor is registered properly**
- Doctor needs to complete registration via `/doc` form
- This creates a record in MongoDB with `_id`
- Doctor must be logged in with the same Firebase account

### 2. **Verify doctor appears in search**
Open browser console on patient search page and check:
```javascript
// Check if registered doctors are being fetched
console.log("Registered doctors:", registeredDoctors);
```

### 3. **Payment flow for REGISTERED vs MOCK doctors**

**For REGISTERED doctors (source: "registered"):**
- Patient selects doctor → `/api/doctor/select/:doctorId` is called
- Patient pays → `/api/payments/create-intent` creates entry with `paid: false`
- Payment succeeds → `/api/payments/confirm` sets `paid: true` and `paidAt`
- ✅ Doctor should see this in dashboard

**For MOCK doctors (source: "mock"):**
- Patient pays → payment completes but NOT stored in database
- ❌ Doctor dashboard won't show this (mock doctors aren't in DB)

## How to Test

### Step 1: Verify Doctor Registration
1. Open browser DevTools → Console
2. Login as doctor
3. Navigate to doctor dashboard at `/doctor-dashboard`
4. Check console for:
   ```
   ✅ Doctor data loaded: { doctor: {...} }
   📋 All interested patients: [...]
   💰 Paid patients: [...]
   ```

### Step 2: Check Database Directly
If you have MongoDB access:
```javascript
// Find doctor by email/uid
db.doctors.findOne({ email: "doctor@example.com" })

// Check interestedPatients array
// Should see entries with: uid, name, email, slotTime, consultationId, paid, paidAt
```

### Step 3: Test Patient Payment Flow
1. Login as patient
2. Search for doctor
3. **IMPORTANT**: Make sure you're selecting a REGISTERED doctor (not mock)
   - Check browser console for `doctor.source === "registered"`
4. Select time slot and pay
5. After payment, check:
   - localStorage should have `consultation_${doctorId}_${patientUid}`
   - Backend should have updated doctor record

### Step 4: Verify on Doctor Dashboard
1. Login as doctor (same account that registered)
2. Navigate to `/doctor-dashboard`
3. Check console logs:
   - "📋 All interested patients:" should show the entry
   - Patient card should appear with payment status

## Common Issues

### Issue 1: Doctor seeing "No doctor profile found"
**Solution:** Doctor hasn't completed registration via `/doc` form

### Issue 2: Payment completes but doctor doesn't see patient
**Possible causes:**
- Patient paid for a MOCK doctor (not in database)
- `doctor.source !== "registered"` so confirm endpoint wasn't called
- doctorId mismatch between frontend and backend
- Doctor logged in with different Firebase account

### Issue 3: consultationId mismatch
Check that:
- `/api/payments/create-intent` returns consultationId
- Frontend stores it in localStorage
- `/api/payments/confirm` receives same consultationId
- consultationId exists in doctor.interestedPatients array

## Debug Commands

### Check localStorage (run in browser console):
```javascript
// Check all stored consultations
Object.keys(localStorage).filter(k => k.startsWith('consultation_'))
  .forEach(k => console.log(k, JSON.parse(localStorage.getItem(k))));
```

### Check current user:
```javascript
// In browser console on any authenticated page
firebase.auth().currentUser.then(user => console.log("Current user:", user.uid, user.email));
```

### Test backend endpoints directly:
```bash
# Get doctor profile (replace TOKEN with your Firebase ID token)
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/doctor/profile

# Check payment status
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/payments/status/CONSULTATION_ID
```

## Quick Fix Checklist

- [ ] Doctor is registered via `/doc` form
- [ ] Doctor appears in `/api/doctor/public` endpoint
- [ ] Patient selects REGISTERED doctor (not mock)
- [ ] Payment uses correct doctorId (MongoDB _id)
- [ ] `/api/payments/confirm` is called after payment
- [ ] Doctor dashboard fetches with correct Firebase token
- [ ] Console shows patient data in "📋 All interested patients:"

## Next Steps if Still Broken

1. **Add more logging to backend:**
   - Log when `/api/payments/create-intent` is called with doctorId
   - Log when `/api/payments/confirm` updates the record
   - Log when `/api/doctor/profile` returns data

2. **Verify database state:**
   - Check MongoDB directly to see if interestedPatients array exists
   - Verify paid and paidAt fields are set correctly

3. **Test with dummy payment:**
   - Use `/api/payments/initiate` endpoint (sets paid=true immediately)
   - This bypasses Stripe and should show patient instantly
