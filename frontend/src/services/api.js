const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

async function request(
  endpoint,
  options = {}
) {
  const token =
    localStorage.getItem("token");

  const response = await fetch(
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

  const data =
    await response
      .json()
      .catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message ||
        "Something went wrong"
    );

    error.status = response.status;

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

export async function createJob(jobData) {
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