import mongoose from "mongoose";

export const connectDB = async () => {
  // 1 = connected, 2 = connecting
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise(); // wait for connection if still connecting
    return;
  }

  await mongoose.connect(process.env.MONGODB_URL as string, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  console.log("MongoDB connected");
};
