const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

const sendPasswordResetEmail = async (
    email,
    resetCode
) => {
    const mailOptions = {
        from: `"Alpha Project" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: "Password Reset Code",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset</h2>

        <p>
          We received a request to reset your password.
        </p>

        <p>Your password reset code is:</p>

        <h1 style="letter-spacing: 5px;">
          ${resetCode}
        </h1>

        <p>
          This code will expire in <strong>10 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset,
          please ignore this email.
        </p>

        <br>

        <p>
          Regards,<br>
          <strong>Alpha Project Team</strong>
        </p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendPasswordResetEmail,
};