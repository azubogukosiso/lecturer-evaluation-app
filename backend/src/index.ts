import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/evaluate", evaluateRoutes);
app.use("/lecturer", lecturerRoutes);

// Start workers (they handle their own Redis connection)
startOvrRatingWorker();
startDeptRatingWorker();
startFacultyRatingWorker();
startCourseRatingWorker();

export default app;
