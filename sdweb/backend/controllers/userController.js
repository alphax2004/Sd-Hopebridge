import { hashPassword } from "../utils/helpers.js";
import User from "../model/user.js";
import jwt from "jsonwebtoken";

// Register
export const createUser = async (req, res) => {
  const { fullName, email, password, bloodGroup } = req.body;

  try {
    const otherUser = await User.findOne({
      email: email?.toLowerCase(),
    }).select(["email"]);

    if (otherUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      fullName,
      email: email?.toLowerCase(),
      password: hashedPassword,
      bloodGroup,
    });

    await newUser.save();
    return res.status(201).json({ message: "New user added successfully" });
  } catch (err) {
    return res.status(400).json(err);
  }
};

// Logged-in user এর profile (cookie token থেকে)
export const getProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userInfo = await User.findById(decoded.id).select([
      "-password",
      "-__v",
    ]);
    return res.status(200).json(userInfo);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select(["-password", "-__v"]);
    return res.status(200).json(allUsers);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const updateUser = async (req, res) => {
  const { fullName, email, password, bloodGroup } = req.body;
  const { id } = req.params;

  try {
    if (email) {
      const anotherUser = await User.findOne({ email: email.toLowerCase() })
        .select("_id")
        .lean();
      if (anotherUser && anotherUser._id.toString() !== id) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    const updateData = { fullName, email, bloodGroup };
    if (password) {
      updateData.password = await hashPassword(password);
    }

    const updatedUser = await User.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
    }).select(["-password", "-__v"]);

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.deleteOne({ _id: id });
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    return res.status(400).json(err);
  }
};
