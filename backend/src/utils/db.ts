import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URL as string);
  isConnected = true;
};
