import express from "express";
import { createCourse, getCourses } from "../controllers/courseController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// protected + role-based
router.post("/", authMiddleware, authorize("instructor"), createCourse);

// public
router.get("/", getCourses);

export default router;
import { enrollCourse } from "../controllers/courseController.js";

// student only
router.post("/:id/enroll", authMiddleware, authorize("student"), enrollCourse);