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

// ROUTES — remove /api prefix, Vercel's routePrefix handles that
app.use("/auth", authRoutes);
app.use("/evaluate", evaluateRoutes);
app.use("/lecturer", lecturerRoutes);

// MONGODB CONNECTION — connect but don't call app.listen()
mongoose
  .connect(process.env.MONGODB_URL as string)
  .then(() => {
    startOvrRatingWorker();
    startDeptRatingWorker();
    startFacultyRatingWorker();
    startCourseRatingWorker();
  })
  .catch((err) => {
    console.log("Error connecting to database: ", err);
  });

export default app;
