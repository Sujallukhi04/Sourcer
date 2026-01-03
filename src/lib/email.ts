import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
) {
  const VerificationLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Email Verification For Testing",
    html: `<h2>Email Verification</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${VerificationLink}">Verify Email</a>
        <p>Or copy and paste this link: ${VerificationLink}</p>
        <p>This link will expire in hour.</p>`,
  };

  try {
    console.log("Transporter created, attempting to send email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification Mail sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending Verification email:", error);
    throw error;
  }
}
export async function sendEmployeeCredentialsEmail(
  email: string,
  name: string,
  employeeId: string,
  autoPassword: string,
  companyName: string
) {
  const loginLink = `${process.env.BASE_URL}/auth/login`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Welcome to ${companyName} - Employee Credentials`,
    html: `
      <h2>Welcome to ${companyName}!</h2>
      <p>Dear ${name},</p>
      <p>Your account has been created successfully. Below are your login credentials:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Employee ID:</strong> ${employeeId}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${autoPassword}</p>
      </div>
      <p><strong>Important:</strong> Please change your password after your first login.</p>
      <p><a href="${loginLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Your Account</a></p>
      <p>If you did not expect this email, please contact your HR department.</p>
      <p>Regards,<br>HR Department - ${companyName}</p>
    `,
  };

  try {
    console.log("Sending employee credentials email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Employee credentials email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending employee credentials email:", error);
    throw error;
  }
}
