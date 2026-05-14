import express from "express";
import { createQuiz, getQuizByCourse, submitQuiz } from "../controllers/quizController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorize("instructor"), createQuiz);
router.get("/:courseId", authMiddleware, getQuizByCourse);
router.post("/submit", authMiddleware, authorize("student", "instructor"), submitQuiz);

export default router;