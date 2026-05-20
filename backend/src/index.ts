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

import { connectDB } from "./utils/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  app.use("/api/auth", authRoutes);
  app.use("/api/evaluate", evaluateRoutes);
  app.use("/api/lecturer", lecturerRoutes);

  connectDB()
    .then(() => {
      startOvrRatingWorker();
      startDeptRatingWorker();
      startFacultyRatingWorker();
      startCourseRatingWorker();

      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to database:", err);
      process.exit(1);
    });
} else {
  app.use("/auth", authRoutes);
  app.use("/evaluate", evaluateRoutes);
  app.use("/lecturer", lecturerRoutes);

  startOvrRatingWorker();
  startDeptRatingWorker();
  startFacultyRatingWorker();
  startCourseRatingWorker();
}

export default app;
