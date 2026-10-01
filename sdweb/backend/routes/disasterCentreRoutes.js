import express from "express";

import checkToken from "../middlewares/checkToken.js";
import checkAdmin from "../middlewares/checkAdmin.js";

import {
  getDisasterCentre,
  updateDisasterCentre,
} from "../controller/disasterCentreController.js";

const router = express.Router();

router.get(
  "/",
  checkToken,
  getDisasterCentre
);

router.put(
  "/",
  checkToken,
  checkAdmin,
  updateDisasterCentre
);

export default router;