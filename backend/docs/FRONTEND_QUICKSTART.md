# 🚀 Frontend Quick Start - Airbnb Experiences MVP

## API Base URL
```
http://localhost:5000/api/v1
```

## 📦 Test Data Ready!

### Test Accounts (Password: `Password123!`)

**🏠 Hosts:**
- `maria@airbnb.com` - NYC Food Tour host
- `kenji@airbnb.com` - Sushi Class host  
- `sophie@airbnb.com` - Yoga instructor

**👤 Guests:**
- `john@example.com`
- `emma@example.com`

### 3 Live Experiences:
1. **NYC Food Tour** - $75/person, 3 hours, Food & Drink
2. **Sushi Making Class** - $95/person, 2.5 hours, Food & Drink
3. **Sunrise Yoga** - $45/person, 1.5 hours, Wellness

---

## 🎯 MVP Feature Implementation

### 1️⃣ GUEST DISCOVERY PAGE

**API Call:**
```javascript
const fetchExperiences = async (filters = {}) => {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 12,
    ...(filters.city && { city: filters.city }),
    ...(filters.category && { category: filters.category }),
    ...(filters.minPrice && { minPrice: filters.minPrice }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    ...(filters.sortBy && { sortBy: filters.sortBy }), // price|rating|popular|recent
  });

  const response = await fetch(`/api/v1/experiences?${params}`);
  const { data } = await response.json();
  return data; // { experiences: [...], pagination: {...} }
};
```

**Experience Card Data:**
```javascript
{
  id: "uuid",
  title: "NYC Food Tour: Taste of Little Italy & Chinatown",
  tagline: "Discover authentic flavors with a local foodie",
  city: "New York",
  country: "United States",
  pricePerPerson: 75,
  duration: 180, // minutes
  averageRating: 4.8,
  totalReviews: 156,
  guestFavorite: true, // Show badge
  photos: [{
    url: "https://images.unsplash.com/...",
    isCover: true
  }],
  host: {
    firstName: "Maria",
    lastName: "Rodriguez"
  }
}
```

**Display:**
- Photo: `experience.photos[0]?.url`
- Title: `experience.title`
- Price: `$${experience.pricePerPerson} / person`
- Rating: `⭐ ${experience.averageRating} (${experience.totalReviews})`
- Duration: `${Math.floor(experience.duration / 60)}h ${experience.duration % 60}m`
- Location: `${experience.city}, ${experience.country}`

**Filters to implement:**
- Price range slider (GET `/experiences?minPrice=50&maxPrice=100`)
- Category dropdown (FOOD_DRINK, WELLNESS, ARTS_CULTURE, etc.)
- Sort by (popular, price, rating, recent)

---

### 2️⃣ EXPERIENCE DETAIL PAGE

**API Call:**
```javascript
const fetchExperienceDetails = async (experienceId) => {
  const response = await fetch(`/api/v1/experiences/${experienceId}`);
  const { data } = await response.json();
  return data;
};
```

**Full Response:**
```javascript
{
  // Basic info
  id, title, tagline, description, category, type,
  
  // Host
  host: {
    id, firstName, lastName, photo, bio,
    createdAt // "Host since [year]"
  },
  
  // Details
  duration, maxGuests, language, skillLevel,
  pricePerPerson, groupDiscount,
  
  // Location
  city, country, meetingPoint, address,
  latitude, longitude, // For map
  
  // Lists
  requirements: ["18 years or older", ...],
  included: ["Food samples", ...],
  toBring: ["Camera", ...],
  
  // Photos
  photos: [
    { id, url, order, isCover },
    ...
  ],
  
  // Itinerary timeline
  itinerary: [
    {
      order: 1,
      title: "Welcome & Italian Pastries",
      description: "Meet at visitor center...",
      duration: 30 // minutes
    },
    ...
  ],
  
  // Available time slots
  schedules: [
    {
      id: "uuid",
      startDateTime: "2026-02-15T11:00:00.000Z",
      endDateTime: "2026-02-15T14:00:00.000Z",
      maxSpots: 8,
      spotsRemaining: 2, // Show "Only 2 spots left!"
      status: "AVAILABLE"
    },
    ...
  ],
  
  // Reviews (5 latest)
  reviews: [...],
  _count: {
    reviews: 156,
    bookings: 189
  },
  
  // Policies
  cancellationDeadlineHours: 24,
  minimumNoticeHours: 12,
  isInstantBook: true
}
```

**UI Components:**

**Photo Gallery:**
```jsx
<div className="photo-gallery">
  <img src={experience.photos.find(p => p.isCover)?.url} className="hero" />
  <div className="thumbnails">
    {experience.photos.slice(1).map(photo => (
      <img key={photo.id} src={photo.url} onClick={() => openLightbox()} />
    ))}
  </div>
</div>
```

**Itinerary Timeline:**
```jsx
<div className="itinerary">
  <h3>What You'll Do</h3>
  {experience.itinerary.map(step => (
    <div key={step.order} className="step">
      <div className="number">{step.order}</div>
      <div className="content">
        <h4>{step.title}</h4>
        <p>{step.description}</p>
        <span className="duration">{step.duration} min</span>
      </div>
    </div>
  ))}
</div>
```

**Sticky Booking Card:**
```jsx
<div className="booking-card">
  <div className="price">
    <span>${experience.pricePerPerson}</span> / person
    {experience.groupDiscount > 0 && (
      <small>Save {experience.groupDiscount}% for 4+ guests</small>
    )}
  </div>
  
  <select onChange={e => setScheduleId(e.target.value)}>
    {experience.schedules.map(slot => (
      <option key={slot.id} value={slot.id}>
        {formatDate(slot.startDateTime)} - {slot.spotsRemaining} spots left
      </option>
    ))}
  </select>
  
  <input 
    type="number" 
    min="1" 
    max={selectedSchedule?.spotsRemaining}
    value={guestCount}
    onChange={e => setGuestCount(parseInt(e.target.value))}
  />
  
  <div className="total">
    Total: ${calculateTotal()}
  </div>
  
  <button onClick={handleReserve}>
    {experience.isInstantBook ? 'Reserve' : 'Request to Book'}
  </button>
</div>
```

**Price Calculation:**
```javascript
const calculateTotal = (guestCount, experience) => {
  const subtotal = experience.pricePerPerson * guestCount;
  
  // Group discount if 4+ guests
  const discount = (guestCount >= 4 && experience.groupDiscount)
    ? subtotal * (experience.groupDiscount / 100)
    : 0;
  
  const serviceFee = (subtotal - discount) * 0.14; // 14%
  const taxes = (subtotal - discount) * 0.08; // 8%
  const total = subtotal - discount + serviceFee + taxes;
  
  return {
    subtotal,
    discount,
    serviceFee,
    taxes,
    total: Math.round(total * 100) / 100
  };
};
```

---

### 3️⃣ BOOKING FLOW

**Step 1: Auth Check**
```javascript
// Check if logged in
const token = localStorage.getItem('accessToken');
if (!token) {
  // Redirect to login/register modal
  showAuthModal();
  return;
}
```

**Step 2: Create Booking**
```javascript
const createBooking = async (bookingData) => {
  const response = await fetch('/api/v1/bookings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      scheduleId: selectedSchedule.id,
      guestCount: 2,
      guestNames: ['John Smith', 'Jane Doe'], // Collect in form
      specialRequests: 'Vegetarian options please',
      messageToHost: 'So excited for this!'
    })
  });
  
  const { data } = await response.json();
  return data; // Booking object with confirmationCode
};
```

**Booking Response:**
```javascript
{
  id: "uuid",
  confirmationCode: "A1B2C3D4", // Display prominently
  status: "CONFIRMED", // or "PENDING"
  guestCount: 2,
  guestNames: ["John Smith", "Jane Doe"],
  
  // Pricing breakdown
  pricePerPerson: 75,
  subtotal: 150,
  groupDiscount: 0,
  serviceFee: 21,
  taxes: 12,
  total: 183,
  
  createdAt: "2026-02-15T10:00:00.000Z",
  
  // Experience details
  experience: {
    id, title,
    host: { firstName, lastName, email, photo },
    photos: [...]
  },
  
  // Schedule
  schedule: {
    startDateTime: "2026-02-15T11:00:00.000Z",
    endDateTime: "2026-02-15T14:00:00.000Z"
  },
  
  guest: { id, firstName, lastName, email }
}
```

**Step 3: Confirmation Page**
```jsx
<div className="confirmation">
  <h1>✅ Booking Confirmed!</h1>
  <div className="confirmation-code">
    <strong>Confirmation Code:</strong> {booking.confirmationCode}
  </div>
  
  <div className="details">
    <h3>{booking.experience.title}</h3>
    <p>📅 {formatDate(booking.schedule.startDateTime)}</p>
    <p>👥 {booking.guestCount} guests</p>
    <p>💰 Total: ${booking.total}</p>
  </div>
  
  <div className="host-contact">
    <h4>Your Host: {booking.experience.host.firstName}</h4>
    <p>📧 {booking.experience.host.email}</p>
  </div>
  
  <button onClick={() => navigate('/trips')}>View My Trips</button>
</div>
```

**Step 4: View Bookings**
```javascript
const fetchMyBookings = async () => {
  const response = await fetch('/api/v1/bookings/my-bookings', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  const { data } = await response.json();
  return data; // Array of bookings
};
```

---

### 4️⃣ HOST DASHBOARD

**Login as Host:**
```javascript
// Use: maria@airbnb.com / Password123!
const login = async (email, password) => {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const { data } = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data.user; // Check if role === 'HOST'
};
```

**Create Experience Wizard:**

*Step 1: Basics*
```javascript
const [formData, setFormData] = useState({
  title: '',
  tagline: '',
  description: '',
  category: 'FOOD_DRINK',
  type: 'IN_PERSON'
});
```

*Step 2: Details*
```javascript
{
  duration: 180,
  maxGuests: 8,
  language: 'English',
  city: 'New York',
  country: 'United States',
  meetingPoint: '...',
  ...
}
```

*Step 3: Pricing*
```javascript
{
  pricePerPerson: 75,
  groupDiscount: 10,
  requirements: ['18+', '...'],
  included: ['Food', '...'],
  isInstantBook: true
}
```

*Step 4: Submit*
```javascript
const createExperience = async (data) => {
  const response = await fetch('/api/v1/experiences', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${hostToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const { data: experience } = await response.json();
  return experience; // status: "DRAFT"
};
```

**Upload Photos:**
```javascript
const uploadPhotos = async (experienceId, files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('photos', file));
  
  const response = await fetch(`/api/v1/experiences/${experienceId}/photos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${hostToken}`
    },
    body: formData
  });
  return await response.json();
};
```

**Publish Experience:**
```javascript
const publishExperience = async (experienceId) => {
  const response = await fetch(`/api/v1/experiences/${experienceId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${hostToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'ACTIVE' })
  });
  return await response.json();
};
```

**My Listings:**
```javascript
const fetchMyExperiences = async () => {
  const response = await fetch('/api/v1/experiences/me/list', {
    headers: {
      'Authorization': `Bearer ${hostToken}`
    }
  });
  const { data } = await response.json();
  return data;
};
```

**My Bookings:**
```javascript
const fetchHostBookings = async () => {
  const response = await fetch('/api/v1/bookings/host/bookings', {
    headers: {
      'Authorization': `Bearer ${hostToken}`
    }
  });
  const { data } = await response.json();
  return data; // All bookings for host's experiences
};
```

---

## 🔐 Authentication Flow

**Register:**
```javascript
const register = async (userData) => {
  const response = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'GUEST' // or 'HOST'
    })
  });
  const { data } = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data.user;
};
```

**Protected Route Wrapper:**
```javascript
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

**API Error Handling:**
```javascript
const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  if (response.status === 401) {
    // Token expired - redirect to login
    localStorage.clear();
    window.location.href = '/login';
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error);
  }
  
  return data.data;
};
```

---

## ✅ MVP Checklist

### Guest Features:
- [ ] Search experiences by city
- [ ] Filter by category, price range
- [ ] Sort by popular/price/rating
- [ ] View experience details with photo gallery
- [ ] See itinerary timeline
- [ ] Check available time slots
- [ ] Calculate booking price
- [ ] Create booking (logged in)
- [ ] View booking confirmation
- [ ] See my trips
- [ ] Cancel booking

### Host Features:
- [ ] Register as host
- [ ] Create experience (4-step wizard)
- [ ] Upload 3-5 photos
- [ ] Add itinerary steps
- [ ] Publish experience
- [ ] View my listings
- [ ] See bookings list
- [ ] Confirm bookings (if not instant book)

---

## 🎯 Sample Test Flow

1. **Guest Journey:**
   ```
   Search "New York" → Find NYC Food Tour → View details → 
   Select time slot → Login → Enter guest names → 
   Reserve → See confirmation code → View in "My Trips"
   ```

2. **Host Journey:**
   ```
   Register as Host → Create Experience → Add photos → 
   Add itinerary → Set price → Publish → View in listings → 
   See incoming booking → Confirm (if needed)
   ```

---

## 📱 Responsive Breakpoints

- Mobile: < 768px (Stack booking card below)
- Tablet: 768px - 1024px (2 column grid)
- Desktop: > 1024px (3-4 column grid)

---

## 🚀 Ready to Build!

All backend APIs are **production-ready** and fully tested. The database is seeded with realistic data. Just connect your React/Next.js frontend and start building! 🎉

**Questions?** Check [API_MVP.md](./API_MVP.md) for detailed endpoint documentation.
