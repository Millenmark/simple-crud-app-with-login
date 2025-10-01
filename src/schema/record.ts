import mongoose from "mongoose";

const RecordSchema = new mongoose.Schema(
  {
    country: { type: String, required: true },
    accountType: { type: String, required: true },
    username: { type: String, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    photoUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Record =
  mongoose.models.Record || mongoose.model("Record", RecordSchema);
