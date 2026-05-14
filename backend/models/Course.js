import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  duration: Number
});

const sectionSchema = new mongoose.Schema({
  title: String,
  lectures: [lectureSchema]
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  sections: [sectionSchema]
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);