import { Schema, model } from "mongoose";

const requestSchema =
  new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      type: {
        type: String,
        enum: [
          "Food",
          "Shelter",
          "Medical",
          "Water",
        ],
        required: true,
      },

      items: {
        type: String,
        required: true,
        trim: true,
      },

      quantity: {
        type: String,
        default: "",
        trim: true,
      },

      urgency: {
        type: String,
        enum: [
          "High",
          "Medium",
          "Low",
        ],
        default: "Medium",
      },

      location: {
        type: String,
        required: true,
        trim: true,
      },

      contact: {
        type: String,
        required: true,
        trim: true,
      },

      notes: {
        type: String,
        default: "",
        trim: true,
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Approved",
          "Rejected",
        ],
        default: "Pending",
      },
    },

    {
      timestamps: true,
    }
  );

const Request =
  model(
    "Request",
    requestSchema
  );

export default Request;