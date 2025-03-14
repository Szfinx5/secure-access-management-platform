import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

export default model("User", UserSchema);
