require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");

const app = express();

const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5173";

const allowedOrigins = [
  CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ""));

console.log(
  "Allowed CORS origins:",
  allowedOrigins
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin =
        origin.replace(/\/$/, "");

      if (
        allowedOrigins.includes(
          cleanOrigin
        )
      ) {
        return callback(null, true);
      }

      console.error(
        "CORS blocked origin:",
        origin
      );

      return callback(
        new Error(
          `CORS blocked origin: ${origin}`
        )
      );
    },
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "JobTracker API is running",
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/jobs",
  jobRoutes
);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

const PORT =
  process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `Server running on port ${PORT}`
        );
      }
    );
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error
    );

    process.exit(1);
  });