import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import mongoose from "mongoose";

// CREATE COURSE (Instructor)
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user.id   // ✅ IMPORTANT
    });

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL COURSES
export const getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

// GET SINGLE COURSE
export const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.json(course);
};

// ENROLL
export const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existing = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    });

    if (existing) {
      return res.json({ message: "Already enrolled" });
    }

    await Enrollment.create({
      user: req.user.id,
      course: courseId
    });

    res.json({ message: "Enrolled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};