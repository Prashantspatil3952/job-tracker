const isLocalDevelopment =
  window.location.hostname ===
    "localhost" ||
  window.location.hostname ===
    "127.0.0.1";

const API_URL = isLocalDevelopment
  ? "/api"
  : import.meta.env.VITE_API_URL ||
    "/api";

console.log(
  "JobTracker API URL:",
  API_URL
);

async function request(
  endpoint,
  options = {}
) {
  const token =
    localStorage.getItem("token");

  let response;

  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,

        headers: {
          "Content-Type":
            "application/json",

          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {}),

          ...(options.headers || {}),
        },
      }
    );
  } catch (error) {
    console.error(
      "Network request failed:",
      error
    );

    throw new Error(
      `Cannot connect to JobTracker API: ${API_URL}${endpoint}`
    );
  }

  const data =
    await response
      .json()
      .catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message ||
        "Something went wrong"
    );

    error.status =
      response.status;

    throw error;
  }

  return data;
}

export async function registerUser(
  userData
) {
  return request(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(userData),
    }
  );
}

export async function verifyEmail(
  verificationData
) {
  return request(
    "/auth/verify-email",
    {
      method: "POST",
      body: JSON.stringify(
        verificationData
      ),
    }
  );
}

export async function resendVerificationOtp(
  email
) {
  return request(
    "/auth/resend-otp",
    {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    }
  );
}

export async function loginUser(
  userData
) {
  return request(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(userData),
    }
  );
}

export async function getJobs() {
  return request("/jobs");
}

export async function getJob(id) {
  return request(`/jobs/${id}`);
}

export async function createJob(
  jobData
) {
  return request("/jobs", {
    method: "POST",
    body: JSON.stringify(jobData),
  });
}

export async function updateJob(
  id,
  jobData
) {
  return request(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(jobData),
  });
}

export async function deleteJob(id) {
  return request(`/jobs/${id}`, {
    method: "DELETE",
  });
}


export async function forgotPassword(
  email
) {
  return request(
    "/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    }
  );
}

export async function resetPassword(
  resetData
) {
  return request(
    "/auth/reset-password",
    {
      method: "POST",
      body: JSON.stringify(
        resetData
      ),
    }
  );
}

// AI Resume Analyzer
export async function analyzeResume(resumeText) {
  return request("/ai/resume/analyze", {
    method: "POST",
    body: JSON.stringify({ resumeText }),
  });
}

// Job Description Matcher
export async function matchJobDescription(
  resumeText,
  jobDescription
) {
  return request("/ai/job-match", {
    method: "POST",
    body: JSON.stringify({
      resumeText,
      jobDescription,
    }),
  });
}