# AI JobTracker

An AI-powered job application tracker that helps users organize their job search, analyze resumes, match resumes with job descriptions, and track application progress in one place.

## Features

### AI-Powered Tools

* **AI Resume Analyzer** — Analyze resume content and receive a resume score, summary, strengths, and areas for improvement.
* **AI Job Matcher** — Compare resume content with a job description to identify matching skills and missing keywords.
* **Resume Improvement Suggestions** — Get practical recommendations to improve resume quality and ATS readability.

### Job Application Management

* Create, view, edit, and delete job applications.
* Track application statuses: Applied, Interview, Selected, and Rejected.
* View dashboard summaries and application statistics.
* Keep job application data associated with individual users.

### Authentication and Security

* Secure user registration and login.
* Password hashing with `bcryptjs`.
* Six-digit email verification OTP.
* OTP expiration and resend functionality.
* JWT-based authentication and protected routes.
* User-specific job application data.

### Other Features

* Email delivery using Brevo Transactional Email API.
* MongoDB Atlas database integration.
* Responsive React interface.
* Environment-based configuration for credentials.

## Tech Stack

| Layer          | Technologies                                     |
| -------------- | ------------------------------------------------ |
| Frontend       | React, JavaScript, React Router, Vite, HTML, CSS |
| Backend        | Node.js, Express.js, Mongoose                    |
| Authentication | JWT, bcryptjs                                    |
| Database       | MongoDB Atlas                                    |
| AI Integration | Google Gemini API                                |
| Email          | Brevo Transactional Email API                    |
| Deployment     | Vercel, Render                                   |

## Application Architecture

```text
React + Vite Frontend
       (Vercel)
          |
          | REST API / HTTPS
          v
Node.js + Express Backend
        (Render)
       /     |      \
      v      v       v
 MongoDB   Gemini   Brevo
  Atlas     API      Email
```

## Live Demo

* **Frontend:** https://job-tracker-alpha-amber.vercel.app
* **Backend:** https://job-tracker-b1e0.onrender.com
* **GitHub:** https://github.com/Prashantspatil3952/ai-job-tracker

## Getting Started

### Prerequisites

* Node.js and npm
* MongoDB Atlas account
* Google Gemini API key
* Brevo account and verified sender email for email verification

### 1. Clone the Repository

```bash
git clone https://github.com/Prashantspatil3952/ai-job-tracker.git
cd ai-job-tracker
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `backend/.env` file and configure the required variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_jwt_secret
CLIENT_URL=http://localhost:5173
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email
BREVO_SENDER_NAME=JobTracker
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model
```

Use the Gemini model configured and supported by your API project.

Start the backend:

```bash
npm run dev
```

### 3. Configure the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local frontend at `http://localhost:5173`.

## Environment Variables

### Backend

| Variable             | Purpose                         |
| -------------------- | ------------------------------- |
| `PORT`               | Backend server port             |
| `MONGO_URI`          | MongoDB Atlas connection string |
| `JWT_SECRET`         | JWT signing secret              |
| `CLIENT_URL`         | Allowed frontend origin         |
| `BREVO_API_KEY`      | Brevo email API key             |
| `BREVO_SENDER_EMAIL` | Verified sender email           |
| `BREVO_SENDER_NAME`  | Sender display name             |
| `GEMINI_API_KEY`     | Google Gemini API key           |
| `GEMINI_MODEL`       | Gemini model identifier         |

### Frontend

| Variable       | Purpose              |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

## Deployment

### Backend — Render

1. Connect the GitHub repository to a Render Web Service.
2. Set the root directory to `backend`.
3. Set the build/install command to `npm install`.
4. Set the start command to `node server.js`.
5. Configure the backend environment variables in Render.
6. Set `CLIENT_URL` to the deployed frontend URL.
7. Deploy and verify the service logs.

### Frontend — Vercel

1. Import the GitHub repository into Vercel.
2. Set the root directory to `frontend`.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Set `VITE_API_URL` to the deployed backend API URL, including `/api`.
6. Deploy and test the live application.

## Security

* Never commit `.env` files or real API keys to GitHub.
* Store production secrets in Render environment variables.
* Configure CORS for trusted frontend origins.
* Use strong JWT secrets and protect authenticated endpoints.
* Restrict database access and keep MongoDB credentials private.

## Future Improvements

* Automated unit and API tests.
* Job search, filtering, and pagination.
* Interview reminders and application notes.
* Resume file upload and parsing.
* Improved AI job recommendations.
* Rate limiting and additional security hardening.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author

**Prashant Patil**

GitHub: https://github.com/Prashantspatil3952