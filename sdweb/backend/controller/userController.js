import User from "../model/user.js";
import {
  hashPassword,
  comparePassword,
} from "../utils/helpers.js";
import crypto from "crypto";
import { Resend } from "resend";
 
const resend = new Resend(process.env.RESEND_API_KEY);
 
export const createUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      bloodGroup,
      phone,
      location,
      role,
    } = req.body;
 
    if (
      !fullName ||
      !email ||
      !password ||
      !bloodGroup ||
      !phone ||
      !location ||
      !role
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
 
    const normalizedEmail = email.toLowerCase().trim();
 
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });
 
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
 
    const hashedPassword = await hashPassword(password);
 
    const token = crypto.randomBytes(32).toString("hex");
 
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      bloodGroup,
      phone: phone.trim(),
      location: location.trim(),
      role,
      verified: false,
      verificationToken: token,
      verificationTokenExpires: new Date(
        Date.now() + 15 * 60 * 1000
      ),
    });
 
    const verificationLink =
      `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
 
    try {
      const { data, error } = await resend.emails.send({
        from: "HopeBridge <onboarding@resend.dev>",
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
 
            <p>
              You need to verify your email first to get started.
            </p>
 
            <p>
              Click the button below to verify your email.
            </p>
 
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
 
            <p>
              This verification link will expire in 15 minutes.
            </p>
          </div>
        `,
      });
 
      if (error) {
        console.log(
          "Verification email sending failed:",
          error
        );
      } else {
        console.log(
          `Verification email sent to ${user.email}`,
          data
        );
      }
    } catch (emailError) {
      console.log(
        "Verification email sending failed:",
        emailError
      );
    }
 
    const {
      password: pass,
      verificationToken,
      verificationTokenExpires,
      ...userWithoutSensitiveData
    } = user.toObject();
 
    return res.status(201).json({
      message: "Registration successful",
      user: userWithoutSensitiveData,
    });
  } catch (error) {
    console.log("REGISTRATION ERROR:", error);
 
    return res.status(500).json({
      message: "Registration failed",
    });
  }
};
 
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -__v -verificationToken -verificationTokenExpires"
    );
 
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
 
    return res.status(200).json(user);
  } catch (error) {
    console.log("PROFILE ERROR:", error);
 
    return res.status(500).json({
      message: "Failed to load profile",
    });
  }
};
 
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "-password -__v -verificationToken -verificationTokenExpires"
    );
 
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
 
    return res.status(500).json({
      message: "Failed to get users",
    });
  }
};
 
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
 
    const {
      fullName,
      email,
      bloodGroup,
      phone,
      location,
    } = req.body;
 
    const user = await User.findById(id);
 
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
 
    if (
      !fullName ||
      !email ||
      !bloodGroup ||
      !phone ||
      !location
    ) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }
 
    const normalizedEmail = email.toLowerCase().trim();
 
    user.fullName = fullName.trim();
    user.bloodGroup = bloodGroup;
    user.phone = phone.trim();
    user.location = location.trim();
 
    if (normalizedEmail !== user.email) {
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });
 
      if (existingUser) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
 
      user.email = normalizedEmail;
      user.verified = false;
 
      const token = crypto.randomBytes(32).toString("hex");
 
      user.verificationToken = token;
      user.verificationTokenExpires = new Date(
        Date.now() + 15 * 60 * 1000
      );
 
      await user.save();
 
      const verificationLink =
        `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
 
      try {
        const { data, error } = await resend.emails.send({
          from: "HopeBridge <onboarding@resend.dev>",
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
 
              <p>
                Your email address was changed.
              </p>
 
              <p>
                Please verify your new email address.
              </p>
 
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
 
              <p>
                This verification link will expire in 15 minutes.
              </p>
            </div>
          `,
        });
 
        if (error) {
          console.log(
            "New email verification failed:",
            error
          );
        }
      } catch (emailError) {
        console.log(
          "New email verification failed:",
          emailError
        );
      }
    } else {
      await user.save();
    }
 
    const {
      password: pass,
      verificationToken,
      verificationTokenExpires,
      ...userWithoutSensitiveData
    } = user.toObject();
 
    return res.status(200).json({
      message: "Profile updated successfully",
      user: userWithoutSensitiveData,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error);
 
    return res.status(500).json({
      message: "Update failed",
    });
  }
};
 
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
 
    const user = await User.findById(id);
 
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
 
    await User.findByIdAndDelete(id);
 
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
 
    return res.status(500).json({
      message: "Delete failed",
    });
  }
};
 