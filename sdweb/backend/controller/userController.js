import User from "../model/user.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/helpers.js";

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

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword =
      await hashPassword(password);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      bloodGroup,
      phone,
      location,
      role,
      verified: false,
    });

    const {
      password: pass,
      ...userWithoutPassword
    } = user.toObject();

    return res.status(201).json(
      userWithoutPassword
    );
  } catch (error) {
    console.log(error);

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
    console.log(error);

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

    user.fullName = fullName;
    user.bloodGroup = bloodGroup;
    user.phone = phone;
    user.location = location;

    await user.save();

    const {
      password: pass,
      ...userWithoutPassword
    } = user.toObject();

    return res.status(200).json(
      userWithoutPassword
    );
  } catch (error) {
    console.log(error);

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