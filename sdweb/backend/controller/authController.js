import User from "../model/user.js";
import { comparePassword } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

const lifetime = "3600000"; // 1 ঘন্টা

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() }).select([
    "-__v",
  ]);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isSame = await comparePassword(password, user.password);
  if (!isSame) {
    return res.status(400).json({ error: "Wrong password" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: lifetime }
  );

  res.cookie("token", token, {
    maxAge: lifetime,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  const { password: pass, ...userWithoutPassword } = user.toObject();
  return res.status(200).json(userWithoutPassword);
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  return res.status(200).json({ message: "Logout successful" });
};
