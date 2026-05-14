import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  enrollCourse
} from "../controllers/courseController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

//router.post("/", createCourse);
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", authMiddleware, authorize("instructor"), createCourse);

// enroll
router.post("/enroll/:id", authMiddleware, authorize("student", "instructor"), enrollCourse);

export default router;