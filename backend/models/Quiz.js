import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number // index of correct option
    }
  ]
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);