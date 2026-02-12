# Airbnb Experiences MVP - API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "GUEST" // or "HOST"
}

Response: {
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "maria@airbnb.com",
  "password": "Password123!"
}

Response: {
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id", "email", "firstName", "lastName", "role", "photo" },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: {
  "success": true,
  "data": { full user profile }
}
```

---

## 🎯 MVP FEATURE 1: Guest Discovery

### Search Experiences
```http
GET /experiences?city=New%20York&page=1&limit=12

Query Parameters:
- query       : Text search (title, description, city)
- city        : Filter by city (case-insensitive)
- country     : Filter by country
- category    : FOOD_DRINK | WELLNESS | ARTS_CULTURE | SPORTS | etc.
- type        : IN_PERSON | ONLINE
- minPrice    : Minimum price per person
- maxPrice    : Maximum price per person
- minRating   : Minimum average rating (0-5)
- maxGuests   : Minimum capacity needed
- sortBy      : price | rating | popular | recent
- page        : Page number (default: 1)
- limit       : Results per page (default: 20, max: 100)

Response: {
  "success": true,
  "data": {
    "experiences": [
      {
        "id": "uuid",
        "title": "NYC Food Tour...",
        "tagline": "Discover authentic flavors",
        "category": "FOOD_DRINK",
        "type": "IN_PERSON",
        "city": "New York",
        "country": "United States",
        "pricePerPerson": 75,
        "duration": 180,
        "maxGuests": 8,
        "averageRating": 4.8,
        "totalReviews": 156,
        "guestFavorite": true,
        "host": {
          "id": "uuid",
          "firstName": "Maria",
          "lastName": "Rodriguez",
          "photo": null
        },
        "photos": [{
          "id": "uuid",
          "url": "https://...",
          "isCover": true
        }],
        "_count": {
          "reviews": 156,
          "bookings": 189
        }
      }
    ],
    "pagination": {
      "total": 3,
      "page": 1,
      "limit": 12,
      "totalPages": 1
    }
  }
}
```

---

## 📖 MVP FEATURE 2: Experience Detail Page

### Get Experience by ID
```http
GET /experiences/:id

Response: {
  "success": true,
  "data": {
    "id": "uuid",
    "title": "NYC Food Tour: Taste of Little Italy & Chinatown",
    "tagline": "Discover authentic flavors with a local foodie",
    "description": "Join me for...",
    "category": "FOOD_DRINK",
    "type": "IN_PERSON",
    "duration": 180,
    "maxGuests": 8,
    "language": "English",
    "skillLevel": "Beginner",
    "address": "123 Mulberry Street",
    "city": "New York",
    "country": "United States",
    "latitude": 40.7178,
    "longitude": -73.9968,
    "meetingPoint": "Little Italy Visitor Center",
    "pricePerPerson": 75,
    "groupDiscount": 10,
    "requirements": ["18 years or older", "..."],
    "included": ["Food samples at 6 locations", "..."],
    "toBring": ["Camera", "Appetite"],
    "cancellationDeadlineHours": 24,
    "minimumNoticeHours": 12,
    "isInstantBook": true,
    "status": "ACTIVE",
    "averageRating": 4.8,
    "totalReviews": 156,
    "totalBookings": 189,
    "guestFavorite": true,
    "host": {
      "id": "uuid",
      "firstName": "Maria",
      "lastName": "Rodriguez",
      "photo": null,
      "bio": "Born and raised in NYC...",
      "createdAt": "2025-..."
    },
    "photos": [
      {
        "id": "uuid",
        "url": "https://...",
        "order": 0,
        "isCover": true
      },
      ...
    ],
    "itinerary": [
      {
        "id": "uuid",
        "order": 1,
        "title": "Welcome & Italian Pastries",
        "description": "Meet at the visitor center...",
        "duration": 30
      },
      ...
    ],
    "schedules": [
      {
        "id": "uuid",
        "startDateTime": "2026-02-15T11:00:00.000Z",
        "endDateTime": "2026-02-15T14:00:00.000Z",
        "maxSpots": 8,
        "spotsRemaining": 2,
        "status": "AVAILABLE"
      },
      ...
    ],
    "reviews": [ /* Latest 5 reviews */ ],
    "_count": {
      "reviews": 156,
      "bookings": 189
    }
  }
}
```

---

## 🎫 MVP FEATURE 3: Booking Flow

### Create Booking
```http
POST /bookings
Authorization: Bearer <guest_token>
Content-Type: application/json

{
  "scheduleId": "uuid",
  "guestCount": 2,
  "guestNames": ["John Smith", "Jane Doe"],
  "specialRequests": "Vegetarian options please",
  "messageToHost": "Excited for this experience!"
}

Response: {
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "uuid",
    "confirmationCode": "A1B2C3D4",
    "status": "CONFIRMED", // or "PENDING" if not instant book
    "guestCount": 2,
    "guestNames": ["John Smith", "Jane Doe"],
    "pricePerPerson": 75,
    "subtotal": 150,
    "groupDiscount": 0,
    "serviceFee": 21,
    "taxes": 12,
    "total": 183,
    "createdAt": "...",
    "experience": {
      "id": "uuid",
      "title": "NYC Food Tour...",
      "host": { "id", "firstName", "lastName", "email", "photo" },
      "photos": [...]
    },
    "schedule": {
      "id": "uuid",
      "startDateTime": "2026-02-15T11:00:00.000Z",
      "endDateTime": "2026-02-15T14:00:00.000Z"
    },
    "guest": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john@example.com",
      "photo": null
    }
  }
}

Pricing Calculation:
- Subtotal = pricePerPerson × guestCount
- Group Discount = If guestCount >= 4 and groupDiscount exists: subtotal × (groupDiscount / 100)
- Service Fee = (subtotal - groupDiscount) × 0.14 (14%)
- Taxes = (subtotal - groupDiscount) × 0.08 (8%)
- Total = subtotal - groupDiscount + serviceFee + taxes
```

### Get My Bookings
```http
GET /bookings/my-bookings?status=CONFIRMED
Authorization: Bearer <guest_token>

Query Parameters:
- status: PENDING | CONFIRMED | CANCELLED | COMPLETED | REFUNDED

Response: {
  "success": true,
  "data": [
    {
      "id": "uuid",
      "confirmationCode": "A1B2C3D4",
      "status": "CONFIRMED",
      "guestCount": 2,
      "total": 183,
      "createdAt": "...",
      "experience": {
        "id": "uuid",
        "title": "NYC Food Tour...",
        "host": { ... },
        "photos": [...]
      },
      "schedule": {
        "startDateTime": "2026-02-15T11:00:00.000Z",
        "endDateTime": "2026-02-15T14:00:00.000Z"
      },
      "review": null // or review object if reviewed
    }
  ]
}
```

### Get Booking Details
```http
GET /bookings/:id
Authorization: Bearer <token>

Response: {
  "success": true,
  "data": {
    /* Full booking details including experience, schedule, guest info */
  }
}
```

### Cancel Booking
```http
POST /bookings/:id/cancel
Authorization: Bearer <guest_token>
Content-Type: application/json

{
  "reason": "Schedule conflict"
}

Response: {
  "success": true,
  "message": "Booking cancelled successfully",
  "data": { /* Updated booking with status: CANCELLED */ }
}

Validation:
- Must cancel at least cancellationDeadlineHours before experience
- Cannot cancel COMPLETED or already CANCELLED bookings
```

---

## 🏠 MVP FEATURE 4: Host Dashboard

### Create Experience (Step-by-Step Wizard)
```http
POST /experiences
Authorization: Bearer <host_token>
Content-Type: application/json

{
  // Step 1: Basics
  "title": "NYC Food Tour: Taste of Little Italy & Chinatown",
  "tagline": "Discover authentic flavors with a local foodie",
  "description": "Join me for an unforgettable...",
  "category": "FOOD_DRINK",
  "type": "IN_PERSON",
  
  // Step 2: Details
  "duration": 180,
  "maxGuests": 8,
  "language": "English",
  "skillLevel": "Beginner",
  "city": "New York",
  "country": "United States",
  "address": "123 Mulberry Street",
  "latitude": 40.7178,
  "longitude": -73.9968,
  "meetingPoint": "Little Italy Visitor Center",
  
  // Step 3: Pricing
  "pricePerPerson": 75,
  "groupDiscount": 10,
  "requirements": ["18 years or older"],
  "included": ["Food samples", "Water"],
  "toBring": ["Camera", "Appetite"],
  "cancellationDeadlineHours": 24,
  "minimumNoticeHours": 12,
  "isInstantBook": true
}

Response: {
  "success": true,
  "message": "Experience created successfully",
  "data": {
    "id": "uuid",
    "status": "DRAFT",
    "title": "...",
    /* Full experience object */
  }
}

Note: Experience starts as DRAFT. After adding photos and itinerary,
host can update status to ACTIVE to publish.
```

### Upload Experience Photos
```http
POST /experiences/:id/photos
Authorization: Bearer <host_token>
Content-Type: multipart/form-data

FormData:
- photos[]: File (up to 10 images, max 5MB each)

Response: {
  "success": true,
  "message": "Photos uploaded successfully",
  "data": [
    {
      "id": "uuid",
      "experienceId": "uuid",
      "url": "https://res.cloudinary.com/...",
      "publicId": "experiences/uuid/...",
      "order": 0,
      "isCover": true // First photo auto-set as cover
    },
    ...
  ]
}

Note: First uploaded photo automatically becomes cover photo.
```

### Get My Experiences
```http
GET /experiences/me/list
Authorization: Bearer <host_token>

Response: {
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "NYC Food Tour...",
      "status": "ACTIVE",
      "pricePerPerson": 75,
      "averageRating": 4.8,
      "totalBookings": 189,
      "createdAt": "...",
      "photos": [{ cover photo }],
      "_count": {
        "reviews": 156,
        "bookings": 189,
        "schedules": 14
      }
    }
  ]
}
```

### Update Experience
```http
PUT /experiences/:id
Authorization: Bearer <host_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "pricePerPerson": 85,
  "status": "ACTIVE" // Publish experience
}

Response: {
  "success": true,
  "message": "Experience updated successfully",
  "data": { /* Updated experience */ }
}
```

### Create Schedule
```http
POST /experiences/:id/schedules
Authorization: Bearer <host_token>
Content-Type: application/json

{
  "startDateTime": "2026-02-20T11:00:00.000Z",
  "endDateTime": "2026-02-20T14:00:00.000Z",
  "maxSpots": 8,
  "isRecurring": false
}

Response: {
  "success": true,
  "message": "Schedule created successfully",
  "data": {
    "id": "uuid",
    "experienceId": "uuid",
    "startDateTime": "2026-02-20T11:00:00.000Z",
    "endDateTime": "2026-02-20T14:00:00.000Z",
    "maxSpots": 8,
    "spotsRemaining": 8,
    "status": "AVAILABLE"
  }
}
```

### Get Host Bookings
```http
GET /bookings/host/bookings?status=CONFIRMED
Authorization: Bearer <host_token>

Response: {
  "success": true,
  "data": [
    {
      "id": "uuid",
      "confirmationCode": "A1B2C3D4",
      "status": "CONFIRMED",
      "guestCount": 2,
      "total": 183,
      "createdAt": "...",
      "guest": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Smith",
        "email": "john@example.com",
        "photo": null
      },
      "experience": {
        "id": "uuid",
        "title": "NYC Food Tour...",
        "photos": [...]
      },
      "schedule": {
        "startDateTime": "2026-02-15T11:00:00.000Z",
        "endDateTime": "2026-02-15T14:00:00.000Z"
      }
    }
  ]
}
```

### Confirm Booking (for non-instant book)
```http
POST /bookings/:id/confirm
Authorization: Bearer <host_token>

Response: {
  "success": true,
  "message": "Booking confirmed successfully",
  "data": { /* Updated booking with status: CONFIRMED */ }
}
```

---

## 🎨 Frontend Integration Guide

### 1. Guest Discovery Page
```javascript
// Fetch experiences with filters
const response = await fetch(
  '/api/v1/experiences?city=New%20York&category=FOOD_DRINK&sortBy=rating&page=1&limit=12'
);
const { data } = await response.json();

// Display grid of experience cards:
data.experiences.forEach(exp => {
  // Show: exp.photos[0].url, exp.title, exp.pricePerPerson, 
  //       exp.averageRating, exp.duration, exp.city
});
```

### 2. Experience Detail  Page
```javascript
// Fetch experience details
const response = await fetch(`/api/v1/experiences/${experienceId}`);
const { data: experience } = await response.json();

// Display:
// - Photo gallery: experience.photos
// - Itinerary timeline: experience.itinerary (ordered by step.order)
// - Available slots: experience.schedules (filter future dates)
// - Booking card with price calculator
```

### 3. Booking Flow
```javascript
// Step 1: Guest selects schedule & guest count
const selectedSchedule = experience.schedules[0];
const guestCount = 2;

// Step 2: Calculate total (frontend preview)
const subtotal = experience.pricePerPerson * guestCount;
const discount = guestCount >= 4 ? subtotal * (experience.groupDiscount / 100) : 0;
const serviceFee = (subtotal - discount) * 0.14;
const taxes = (subtotal - discount) * 0.08;
const total = subtotal - discount + serviceFee + taxes;

// Step 3: Submit booking
const response = await fetch('/api/v1/bookings', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    scheduleId: selectedSchedule.id,
    guestCount,
    guestNames: ['John Smith', 'Jane Doe'],
    messageToHost: '...'
  })
});

// Step 4: Show confirmation page with booking.confirmationCode
```

### 4. Host Dashboard
```javascript
// Get my experiences
const response = await fetch('/api/v1/experiences/me/list', {
  headers: { 'Authorization': `Bearer ${hostToken}` }
});
const { data: myExperiences } = await response.json();

// Get my bookings
const bookingsResponse = await fetch('/api/v1/bookings/host/bookings', {
  headers: { 'Authorization': `Bearer ${hostToken}` }
});
const { data: bookings } = await bookingsResponse.json();
```

---

## 📊 Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP Status Codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Validation Error (with details)
- `500` - Internal Server Error

---

## 🧪 Testing the MVP

### 1. Run the MVP seed:
```bash
cd backend
npx ts-node prisma/seed.mvp.ts
```

### 2. Test accounts:
**Hosts:**
- maria@airbnb.com (NYC Food Tour)
- kenji@airbnb.com (Sushi Class)
- sophie@airbnb.com (Yoga Session)

**Guests:**
- john@example.com
- emma@example.com

**Password for all:** `Password123!`

### 3. Sample workflow:
1. Login as guest → Get experiences → View details → Create booking
2. Login as host → View bookings → Confirm reservation
3. Guest can cancel booking (if within deadline)

---

## 🚀 Quick Start

```bash
# Start server
npm run dev

# Login as guest
POST /api/v1/auth/login
{ "email": "john@example.com", "password": "Password123!" }

# Search experiences
GET /api/v1/experiences?city=New%20York

# View experience
GET /api/v1/experiences/{id}

# Create booking
POST /api/v1/bookings
{ "scheduleId": "...", "guestCount": 2 }
```

**MVP is production-ready!** 🎉
