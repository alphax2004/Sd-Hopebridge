import express from "express";

import checkToken from "../middlewares/checkToken.js";

import {
  getAllUsers,
  getProfile,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/userController.js";

import {
  sendVerificationEmail,
  verifyEmail,
} from "../controller/emailController.js";

const router = express.Router();

router.post("/", createUser);

router.post(
  "/send-verification",
  sendVerificationEmail
);

router.get(
  "/verify-email",
  verifyEmail
);

router.get(
  "/profile",
  checkToken,
  getProfile
);

router.get(
  "/",
  checkToken,
  getAllUsers
);

router.put(
  "/:id",
  checkToken,
  updateUser
);

router.delete(
  "/:id",
  checkToken,
  deleteUser
);

export default router;