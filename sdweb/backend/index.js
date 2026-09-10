import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import log from "./middlewares/logger.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(log);

app.use(express.json());

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.ALLOWED_ORIGIN,
  })
);

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(
      `Error connecting to database ${err}`
    );
    process.exit(1);
  });

app.get("/api/test", (req, res) => {
  return res.json({
    message: "Api is working",
  });
});

app.use(
  "/api/auth",
  authRouter
);

app.use(
  "/api/users",
  usersRouter
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    `Server listening on port ${PORT}`
  );
});

export default app;