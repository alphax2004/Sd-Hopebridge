import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    disasters: [
      {
        title: String,
        type: { type: String },
        location: String,
        severity: String,
        description: String,
        icon: String,
        active: Boolean,
      },
    ],

    shelters: [
      {
        name: String,
        location: String,
        capacity: Number,
        occupied: Number,
      },
    ],

    news: [
      {
        title: String,
        text: String,
        icon: String,
      },
    ],
  },
  { timestamps: true }
);

const DisasterCentre = model("DisasterCentre", schema);

export default DisasterCentre;