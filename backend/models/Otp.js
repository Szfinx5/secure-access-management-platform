import { Schema, model } from "mongoose";

const OtpSchema = new Schema({
  phone: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

export default model("Otp", OtpSchema);
