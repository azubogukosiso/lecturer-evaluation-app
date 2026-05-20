import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import evaluateRoutes from "./routes/evaluate";
import lecturerRoutes from "./routes/lecturer";

import { start as startOvrRatingWorker } from "./workers/ovrRatingWorker";
import { start as startDeptRatingWorker } from "./workers/deptRatingWorker";
import { start as startFacultyRatingWorker } from "./workers/facultyRatingWorker";
import { start as startCourseRatingWorker } from "./workers/courseRatingWorker";

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ROUTES
app.use("/auth", authRoutes);
app.use("/evaluate", evaluateRoutes);
app.use("/lecturer", lecturerRoutes);

// MONGODB CONNECTION with serverless-friendly options
mongoose
  .connect(process.env.MONGODB_URL as string, {
    serverSelectionTimeoutMS: 10000, // fail fast if Atlas unreachable
    socketTimeoutMS: 45000,          // max time for any operation
    bufferCommands: false,           // don't queue ops if disconnected — fail immediately
  })
  .then(() => {
    console.log("MongoDB connected");
    startOvrRatingWorker();
    startDeptRatingWorker();
    startFacultyRatingWorker();
    startCourseRatingWorker();
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

export default app;
