# REST API Reference & Documentation

## Overview
This API is designed as a **RESTful service**, providing JSON-formatted data to the Next.js frontend. It features a public-facing API for visitors and a secured Admin API for portfolio management.

### Base URL
`http://localhost:5000/api`

### Authentication
All Admin API endpoints (prefixed with `/admin`) require a **JWT (JSON Web Token)**.
- **Header**: `Authorization: Bearer <your_token>`

---

## 🌎 Public API Endpoints (Read-Only)

### 🏥 System Health
- **Endpoint**: `GET /health`
- **Purpose**: Verify if the backend API is online and healthy.
- **Response**: `{"status": "healthy", "message": "Flask backend is running!"}`

### 👤 Profile Information
- **Endpoint**: `GET /personal-info`
- **Purpose**: Retrieve the portfolio owner's bio, contact details, and social links.
- **Response**: `PersonalInfo` object.

### 💼 Portfolio Sections
- **Endpoints**:
  - `GET /skills`: All categorized tech skills.
  - `GET /projects`: List of all projects (filtered by `?featured=true`).
  - `GET /experience`: Full work history and achievements.
  - `GET /education`: Academic history and course details.
  - `GET /certifications`: Dynamic list of licenses (includes badges and verification URLs).
  - `GET /achievements`: Key stats and high-level highlights.
  - `GET /testimonials`: Feedback from colleagues or clients.
  - `GET /blog`: All published blog posts.

### 📬 User Interaction
- **Endpoint**: `POST /contact`
- **Purpose**: Submit the contact form.
- **Payload**: `{"name": "Name", "email": "email@example.com", "subject": "Topic", "message": "Body"}`
- **Side Effect**: Saves to database and sends an email notification to the owner.

### 📈 Visitor Tracking (Analytics)
- **Endpoint**: `POST /track-visit`
- **Purpose**: Log a new visit with IP-based geolocation, device, and browser data.
- **Payload**: `{"visitorId": "UID", "sessionId": "SID", "deviceType": "Desktop", "browser": "Chrome", "pagePath": "/"}`

- **Endpoint**: `POST /track-duration`
- **Purpose**: Update how much time a user spent in a specific session.

---

## 🔒 Admin API Endpoints (Secured)

### 🔑 Authentication
- **Endpoint**: `POST /admin/login`
- **Payload**: `{"username": "Admin", "password": "Password"}`
- **Response**: `{"token": "JWT_TOKEN", "user": { ... }}`

- **Endpoint**: `GET /admin/verify`
- **Purpose**: Validates the current session token.

### 📂 Content Management (CRUD)
The following endpoints support `GET` (list), `POST` (create), `PUT` (update), and `DELETE` (remove) operations:
- `/admin/projects`
- `/admin/experience`
- `/admin/education`
- `/admin/certifications`
- `/admin/testimonials`
- `/admin/blog`

### 📊 Administrative Tools
- **Endpoint**: `GET /admin/dashboard`
- **Purpose**: Summary of content (counts of projects, skills, messages, etc.).
- **Endpoint**: `GET /admin/analytics`
- **Purpose**: Detailed traffic insights, including visitor trends and geographical maps.
- **Endpoint**: `GET /admin/contacts`
- **Purpose**: Review all messages received via the contact form.

### 🖼️ Media & Uploads
- **Endpoint**: `POST /admin/upload`
- **Purpose**: Handles file uploads (badges, profile pictures, etc.).
- **Payload**: `multipart/form-data` containing an image file.
- **Response**: `{"success": true, "url": "/api/static/uploads/unique_filename.png"}`

- **Static Serving**: `GET /api/static/uploads/<filename>`
- **Purpose**: Serves the uploaded images back to the frontend.

---

## ⚙️ Data Payload Example (Certification)

### POST /admin/certifications
```json
{
  "name": "Oracle Cloud Infrastructure 2024 Foundations Associate",
  "issuer": "Oracle",
  "date": "March 2024",
  "credential": "OCI-FOUND-2024",
  "validity": "No Expiration",
  "badge": "/api/static/uploads/7f2b_badge.png",
  "verify_url": "https://oracle.com/verify/..."
}
```

## 🛠️ Error Handling
The API returns standard HTTP status codes:
- `200/201`: Success
- `400`: Bad Request (Invalid payload)
- `401`: Unauthorized (Missing/invalid token)
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
