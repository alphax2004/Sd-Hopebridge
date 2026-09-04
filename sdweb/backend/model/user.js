import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    bloodGroup: {
      type: Schema.Types.String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    phone: {
      type: Schema.Types.String,
      default: "",
    },
    location: {
      type: Schema.Types.String,
      default: "",
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    role: {
      type: Schema.Types.String,
      enum: ["user", "ngo", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
