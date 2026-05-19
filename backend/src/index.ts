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

// LOAD ENVIRONMENT VARIABLES FROM .ENV FILE
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/evaluate", evaluateRoutes);
app.use("/api/lecturer", lecturerRoutes);

// MONGODB CONNECTION
mongoose
  .connect(process.env.MONGODB_URL as string)
  .then(() => {
    startOvrRatingWorker();
    startDeptRatingWorker();
    startFacultyRatingWorker();
    startCourseRatingWorker();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database: ", err);
  });

export default app;
