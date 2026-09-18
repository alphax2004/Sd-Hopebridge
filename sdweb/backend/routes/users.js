import express from "express";

import checkToken from "../middlewares/checkToken.js";
import checkFirebaseToken from "../middlewares/firebaseToken.js";

import {
  getAllUsers,
  getProfile,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/userController.js";

const router =
  express.Router();


// Registration
router.post(
  "/",
  checkFirebaseToken,
  createUser
);


// Logged-in profile
router.get(
  "/profile",
  checkToken,
  getProfile
);


// All users
router.get(
  "/",
  checkToken,
  getAllUsers
);


// Update user
router.put(
  "/:id",
  checkToken,
  updateUser
);


// Delete user
router.delete(
  "/:id",
  checkToken,
  deleteUser
);

export default router;