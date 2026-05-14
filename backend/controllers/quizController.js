import Quiz from "../models/Quiz.js";
import Attempt from "../models/Attempt.js";
import mongoose from "mongoose";

export const createQuiz = async (req, res) => {
  try {
    const { courseId, title, questions } = req.body;

    if (!courseId || !title || !questions || questions.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId" });
    }

    const normalizedQuestions = questions.map((q) => ({
      question: q.question,
      options: q.options,
      correctAnswer: Number(q.correctAnswer)
    }));

    const hasInvalidQuestion = normalizedQuestions.some(
      (q) =>
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        q.options.some((opt) => !opt) ||
        Number.isNaN(q.correctAnswer) ||
        q.correctAnswer < 0 ||
        q.correctAnswer > 3
    );

    if (hasInvalidQuestion) {
      return res.status(400).json({
        message: "Each question needs text, 4 options, and correctAnswer between 0 and 3."
      });
    }

    const quiz = await Quiz.create({
      course: courseId,
      title,
      questions: normalizedQuestions
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuizByCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
      return res.status(400).json({ message: "Invalid courseId" });
    }

    const quiz = await Quiz.findOne({ course: req.params.courseId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found for this course" });
    }

    // Hide answers from client before submission.
    const safeQuiz = {
      _id: quiz._id,
      course: quiz.course,
      title: quiz.title,
      questions: quiz.questions.map((q) => ({
        question: q.question,
        options: q.options
      }))
    };

    res.json(safeQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "quizId and answers are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: "Invalid quizId" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    const results = quiz.questions.map((q, index) => {
      const selected = answers[index];
      const correct = q.correctAnswer === selected;
      if (correct) score += 1;
      return {
        correct,
        correctAnswer: q.correctAnswer
      };
    });

    await Attempt.create({
      user: req.user.id,
      quiz: quizId,
      score
    });

    res.json({
      score,
      total: quiz.questions.length,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};