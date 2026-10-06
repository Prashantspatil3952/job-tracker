async function sendVerificationEmail({
  toEmail,
  toName,
  otp,
}) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL;
  const senderName =
    process.env.BREVO_SENDER_NAME ||
    "JobTracker";

  if (!apiKey) {
    throw new Error(
      "BREVO_API_KEY is missing"
    );
  }

  if (!senderEmail) {
    throw new Error(
      "BREVO_SENDER_EMAIL is missing"
    );
  }

  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",

      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },

      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },

        to: [
          {
            email: toEmail,
            name: toName,
          },
        ],

        subject:
          "JobTracker - Verify your email",

        textContent:
          `Hello ${toName},\n\n` +
          `Your JobTracker verification code is: ${otp}\n\n` +
          `This code expires in 10 minutes.\n\n` +
          `If you did not create this account, you can ignore this email.`,

        htmlContent: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif;">
              <h2>Welcome to JobTracker</h2>

              <p>Hello ${toName},</p>

              <p>Your email verification code is:</p>

              <h1 style="letter-spacing: 8px;">
                ${otp}
              </h1>

              <p>
                This code expires in
                <strong>10 minutes</strong>.
              </p>

              <p>
                If you did not create this account,
                you can ignore this email.
              </p>

              <p>— JobTracker</p>
            </body>
          </html>
        `,
      }),
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Brevo failed to send email"
    );
  }

  return data;
}

module.exports = {
  sendVerificationEmail,
};