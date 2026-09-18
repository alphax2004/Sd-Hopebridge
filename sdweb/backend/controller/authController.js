import User from "../model/user.js";
import admin from "../firebaseAdmin.js";
import jwt from "jsonwebtoken";

const JWT_LIFETIME = "1h";
const COOKIE_MAX_AGE = 60 * 60 * 1000;


// ==========================================
// LOGIN
// ==========================================

export const login = async (req, res) => {
  try {

    // Get Authorization header
    const authHeader =
      req.headers.authorization;

    console.log(
      "AUTH HEADER EXISTS:",
      !!authHeader
    );


    // Check Authorization header
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(400).json({
        error: "Firebase token is required",
      });
    }


    // Get Firebase token
    const firebaseToken =
      authHeader.split(" ")[1];


    if (!firebaseToken) {
      return res.status(400).json({
        error: "Invalid Firebase token",
      });
    }


    console.log(
      "FIREBASE TOKEN RECEIVED"
    );


    // ==========================================
    // Verify Firebase token
    // ==========================================

    const decodedToken =
      await admin
        .auth()
        .verifyIdToken(firebaseToken);


    console.log(
      "FIREBASE USER:",
      decodedToken.uid
    );


    const firebaseUid =
      decodedToken.uid;

    const firebaseEmail =
      decodedToken.email
        ?.toLowerCase()
        .trim();


    // ==========================================
    // Check Firebase email
    // ==========================================

    if (!firebaseEmail) {
      return res.status(400).json({
        error:
          "Firebase email not found",
      });
    }


    // ==========================================
    // Check email verification
    // ==========================================

    if (!decodedToken.email_verified) {
      return res.status(403).json({
        error:
          "Please verify your email first",
        verified: false,
      });
    }


    // ==========================================
    // Find MongoDB user
    // ==========================================

    const user =
      await User.findOne({
        firebaseUid: firebaseUid,
      }).select("-__v");


    if (!user) {

      console.log(
        "MONGO USER NOT FOUND:",
        firebaseUid
      );

      return res.status(404).json({
        error:
          "User profile not found",
      });
    }


    // ==========================================
    // Update verification status
    // ==========================================

    user.verified = true;

    await user.save();


    // ==========================================
    // Create JWT
    // ==========================================

    const token =
      jwt.sign(
        {
          id:
            user._id.toString(),

          email:
            user.email,

          role:
            user.role,
        },

        process.env.JWT_SECRET,

        {
          expiresIn:
            JWT_LIFETIME,
        }
      );


    // ==========================================
    // Cookie settings
    // ==========================================

    const isProd =
      process.env.NODE_ENV ===
      "production";


    res.cookie(
      "token",
      token,
      {
        maxAge:
          COOKIE_MAX_AGE,

        httpOnly:
          true,

        secure:
          isProd,

        sameSite:
          isProd
            ? "none"
            : "lax",

        path: "/",
      }
    );


    // ==========================================
    // Remove password/sensitive fields
    // ==========================================

    const {
      password: pass,
      verificationToken,
      verificationTokenExpires,
      ...userWithoutPassword
    } = user.toObject();


    // ==========================================
    // SUCCESS
    // ==========================================

    return res.status(200).json({
      message:
        "Login successful",

      user:
        userWithoutPassword,
    });

  } catch (error) {

    console.log(
      "LOGIN ERROR:",
      error
    );


    // Firebase token error
    if (
      error.code ===
        "auth/id-token-expired" ||
      error.code ===
        "auth/argument-error" ||
      error.code ===
        "auth/invalid-id-token"
    ) {

      return res.status(401).json({
        error:
          "Invalid or expired Firebase token",
      });
    }


    return res.status(500).json({
      error:
        "Login failed",
    });
  }
};


// ==========================================
// LOGOUT
// ==========================================

export const logout = (req, res) => {

  const isProd =
    process.env.NODE_ENV ===
    "production";


  res.clearCookie(
    "token",
    {
      httpOnly:
        true,

      secure:
        isProd,

      sameSite:
        isProd
          ? "none"
          : "lax",

      path: "/",
    }
  );


  return res.status(200).json({
    message:
      "Logout successful",
  });
};