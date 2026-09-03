import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to database");
  } catch (err) {
    console.log(`Error connecting to database ${err}`);
    process.exit(1);
  }
};

connectDB();