import Course from "../models/Course.js";

// CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = await Course.create({
      title,
      description,
      instructor: req.user.id
    });

    res.status(201).json(course);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL COURSES
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "email");

    res.json(courses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ENROLL IN COURSE (Student only)
export const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // prevent duplicate enrollment
    if (course.students.includes(req.user.id)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.students.push(req.user.id);

    await course.save();

    res.json({ message: "Enrolled successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};