import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure:
    process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
  path: "/",
};

const checkToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, user) => {
      if (err) {
        res.clearCookie(
          "token",
          cookieOptions
        );

        return res.status(401).json({
          error: "Invalid token",
        });
      }

      req.user = user;

      next();
    }
  );
};

export default checkToken;