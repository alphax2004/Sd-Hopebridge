import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../model/user.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.verificationToken = token;
    user.verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "HopeBridge Email Verification",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
        ">
          <h2>HopeBridge Email Verification</h2>
          <p>You need to verify your email first to get started.</p>
          <p>Click the button below to verify your email.</p>
          <a
            href="${verificationLink}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#f0a00c;
              color:black;
              text-decoration:none;
              border-radius:7px;
              font-weight:bold;
            "
          >
            Verify Email
          </a>
          <p>This verification link will expire in 15 minutes.</p>
        </div>
      `,
    });

    return res.status(200).json({
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to send verification email",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is missing",
      });
    }

    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid verification link",
      });
    }

    if (
      !user.verificationTokenExpires ||
      user.verificationTokenExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Verification link has expired",
      });
    }

    user.verified = true;
    user.verificationToken = "";
    user.verificationTokenExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Email verification failed",
    });
  }
};
