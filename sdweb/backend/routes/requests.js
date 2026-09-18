import express from "express";

import checkToken from "../middlewares/checkToken.js";
import checkAdmin from "../middlewares/checkAdmin.js";

import {
  createRequest,
  getMyRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
} from "../controller/requestController.js";

const router =
  express.Router();


// ===============================
// VICTIM ROUTES
// ===============================

router.post(
  "/",
  checkToken,
  createRequest
);

router.get(
  "/my",
  checkToken,
  getMyRequests
);


// ===============================
// ADMIN ROUTES
// ===============================

router.get(
  "/",
  checkToken,
  checkAdmin,
  getAllRequests
);

router.put(
  "/:id/approve",
  checkToken,
  checkAdmin,
  approveRequest
);

router.put(
  "/:id/reject",
  checkToken,
  checkAdmin,
  rejectRequest
);

export default router;