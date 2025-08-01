import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['L1', 'L2', 'L3'], required: true },
}, { timestamps: true })

export default model('User', userSchema)