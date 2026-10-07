# JobTracker

A full-stack job application tracker that helps users manage, organize, and monitor their job search from one place.

JobTracker provides secure user authentication, email verification, protected APIs, and complete job application management with status tracking.

## Features

- User registration and secure login
- Password hashing with `bcryptjs`
- 6-digit email verification OTP
- OTP expiration and resend functionality
- Email delivery with Brevo Transactional Email API
- JWT-based authentication
- Protected React routes and REST API endpoints
- User-specific job application data
- Create, view, edit, and delete job applications
- Application status tracking
- Dashboard summary and application statistics
- Responsive React UI
- MongoDB Atlas persistence
- Environment-based configuration for sensitive credentials

## Job Statuses

- `Applied`
- `Interview`
- `Selected`
- `Rejected`

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, React Router, Vite, HTML, CSS |
| Backend | Node.js, Express.js, Mongoose, JWT, bcryptjs, CORS, dotenv |
| Database | MongoDB Atlas |
| Email | Brevo Transactional Email API |
| Deployment | Vercel, Render |

## Application Flow

### Authentication

```text
Register
   ↓
Create User
   ↓
Hash Password with bcrypt
   ↓
Generate Verification OTP
   ↓
Send OTP by Email
   ↓
Verify OTP
   ↓
Email Verified
   ↓
Login
   ↓
Generate JWT
   ↓
Access Protected Dashboard
```

### Job Management

```text
Login
   ↓
JWT Token
   ↓
Dashboard
   ↓
Add / View / Edit / Delete Job
   ↓
Protected REST API
   ↓
MongoDB Atlas
```

## Architecture

```text
                    React + Vite
                     Frontend
                      (Vercel)
                         │
                         │ REST API / HTTPS
                         ▼
                 Node.js + Express
                      Backend
                     (Render)
                    /         \
                   /           \
                  ▼             ▼
           MongoDB Atlas      Brevo API
             Database        Email / OTP
```

## Project Structure

```text
job-tracker/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── jobController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Job.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── jobRoutes.js
│   ├── services/
│   │   └── emailService.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── JobCard.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddJob.jsx
│   │   │   └── EditJob.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   └── index.html
│
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have:

- Node.js installed
- A MongoDB Atlas database
- A Brevo account with a verified sender email and API key
- Git installed

### 1. Clone the repository

```bash
git clone https://github.com/Prashantspatil3952/job-tracker.git
cd job-tracker
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_jwt_secret
CLIENT_URL=http://localhost:5173
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email
BREVO_SENDER_NAME=JobTracker
```

Start the backend:

```bash
node server.js
```

Backend URL:

```text
http://localhost:5000
```

### 3. Configure the Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Port for the Express server |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `BREVO_API_KEY` | Brevo API key used to send verification emails |
| `BREVO_SENDER_EMAIL` | Verified sender email in Brevo |
| `BREVO_SENDER_NAME` | Sender display name |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

> **Security:** Never commit real credentials, API keys, database connection strings, or JWT secrets to GitHub. Keep them in `.env` locally and configure them as environment variables on your hosting platform.

## REST API

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new user and send a verification OTP |
| `POST` | `/api/auth/verify-email` | Verify the user's email with the OTP |
| `POST` | `/api/auth/resend-otp` | Send a new verification OTP |
| `POST` | `/api/auth/login` | Login and receive a JWT |

### Job Applications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | Get the authenticated user's applications |
| `GET` | `/api/jobs/:id` | Get one application |
| `POST` | `/api/jobs` | Create a job application |
| `PUT` | `/api/jobs/:id` | Update a job application |
| `DELETE` | `/api/jobs/:id` | Delete a job application |

Protected requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

## Data Models

### User

```text
name
email
password
isVerified
verificationOtpHash
verificationOtpExpiresAt
createdAt
updatedAt
```

### Job

```text
company
role
location
salary
status
applicationDate
userId
```

Each job is associated with the authenticated user's `userId`, ensuring application data is scoped to the correct account.

## Security

The application includes:

- Password hashing with `bcryptjs`
- Hashed verification OTP storage
- Expiring email verification OTPs
- JWT authentication with token expiration
- Protected frontend and backend routes
- User-scoped database queries for job records
- CORS configuration through environment variables

For further production hardening, consider adding rate limiting, authentication/OTP attempt throttling, centralized request validation, and secure `HttpOnly` cookie-based JWT storage.

## Deployment

### Backend — Render

1. Create a Render Web Service from this repository.
2. Set the root directory to `backend`.
3. Install dependencies with `npm install`.
4. Start the service with `node server.js`.
5. Add all backend environment variables in Render.
6. Set `CLIENT_URL` to the deployed frontend URL.

### Frontend — Vercel

1. Import the repository into Vercel.
2. Set the root directory to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_URL` pointing to the deployed backend API.
6. Configure a SPA rewrite so React Router routes work on direct navigation and page refresh.

Example `frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Demo & Repository

- **Frontend:** https://job-tracker-alpha-amber.vercel.app
- **Backend:** https://job-tracker-b1e0.onrender.com
- **GitHub:** https://github.com/Prashantspatil3952/job-tracker

## Future Improvements

- Automated unit and API testing
- Search, filtering, and pagination
- Job notes and recruiter information
- Interview date and reminder support
- Password reset and account recovery
- Rate limiting and stronger authentication controls
- CI/CD with GitHub Actions

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

**Prashant Patil**

GitHub: https://github.com/Prashantspatil3952
