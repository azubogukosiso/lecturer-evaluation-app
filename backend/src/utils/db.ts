import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_URL as string, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
  });

  isConnected = true;
  console.log("MongoDB connected");
};
