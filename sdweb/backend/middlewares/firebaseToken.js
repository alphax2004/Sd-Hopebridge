import admin from "../firebaseAdmin.js";

const checkFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Firebase token is missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid Firebase token",
      });
    }

    const decodedToken =
      await admin.auth().verifyIdToken(token);

    req.firebaseUser = decodedToken;

    next();
  } catch (error) {
    console.log(
      "FIREBASE TOKEN ERROR:",
      error
    );

    return res.status(401).json({
      message: "Invalid Firebase token",
    });
  }
};

export default checkFirebaseToken;