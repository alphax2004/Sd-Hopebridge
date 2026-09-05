import User from "../model/user.js";
import { comparePassword } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

const JWT_LIFETIME = "1h";
const COOKIE_MAX_AGE = 60 * 60 * 1000;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("-__v");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const isSame = await comparePassword(
      password,
      user.password
    );

    if (!isSame) {
      return res.status(400).json({
        error: "Wrong password",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        error: "Please verify your email first",
        verified: false,
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: JWT_LIFETIME,
      }
    );

    const isProd =
      process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    const {
      password: pass,
      verificationToken,
      verificationTokenExpires,
      ...userWithoutPassword
    } = user.toObject();

    return res.status(200).json(
      userWithoutPassword
    );
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      error: "Login failed",
    });
  }
};

export const logout = (req, res) => {
  const isProd =
    process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
};