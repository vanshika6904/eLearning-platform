import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { getYoutubeVideoId } from "../utils/video";

const InstructorDashboard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [sections, setSections] = useState([]);
  const [quizCourseId, setQuizCourseId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);
  const [allCourses, setAllCourses] = useState([]);

  // add section
  const addSection = () => {
    setSections([...sections, { title: "", lectures: [] }]);
  };

  // update section title
  const updateSectionTitle = (index, value) => {
    const updated = [...sections];
    updated[index].title = value;
    setSections(updated);
  };

  // add lecture
  const addLecture = (sectionIndex) => {
    const updated = [...sections];
    updated[sectionIndex].lectures.push({
      title: "",
      videoUrl: ""
    });
    setSections(updated);
  };

  // update lecture
  const updateLecture = (sectionIndex, lectureIndex, field, value) => {
    const updated = [...sections];
    updated[sectionIndex].lectures[lectureIndex][field] = value;
    setSections(updated);
  };

  const handleCreate = async () => {
    try {
      const hasInvalidYoutubeUrl = sections.some((section) =>
        section.lectures.some((lecture) => lecture.videoUrl && !getYoutubeVideoId(lecture.videoUrl))
      );

      if (hasInvalidYoutubeUrl) {
        alert("Please enter valid YouTube video URLs for all lectures.");
        return;
      }

      await API.post("/courses", {
        title,
        description,
        thumbnail,
        sections
      });

      alert("Course created!");
    } catch (err) {
      alert("Error creating course");
    }
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const { data } = await API.get("/courses");
        setAllCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        setAllCourses([]);
      }
    };
    loadCourses();
  }, []);

  const addQuizQuestion = () => {
    setQuizQuestions((prev) => [
      ...prev,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 }
    ]);
  };

  const updateQuizQuestion = (qIndex, field, value) => {
    setQuizQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex][field] = value;
      return copy;
    });
  };

  const updateQuizOption = (qIndex, optionIndex, value) => {
    setQuizQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex].options[optionIndex] = value;
      return copy;
    });
  };

  const handleCreateQuiz = async () => {
    try {
      if (!quizCourseId || !quizTitle) {
        alert("Please select a course and enter quiz title.");
        return;
      }
      const hasInvalidQuestion = quizQuestions.some(
        (q) =>
          !q.question ||
          q.options.length !== 4 ||
          q.options.some((opt) => !opt) ||
          q.correctAnswer < 0 ||
          q.correctAnswer > 3
      );
      if (hasInvalidQuestion) {
        alert("Each question must have text, 4 options, and correct option between 0-3.");
        return;
      }
      await API.post("/quiz", {
        courseId: quizCourseId,
        title: quizTitle,
        questions: quizQuestions
      });
      alert("Quiz created successfully!");
      setQuizTitle("");
      setQuizQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create quiz.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="mx-auto max-w-5xl p-6">
        <h2 className="mb-6 text-3xl font-bold text-slate-900">Instructor Dashboard</h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-slate-900">Create New Course</h3>

        <input
          placeholder="Course Title"
          className="mb-3 w-full rounded-lg border border-slate-300 p-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description"
          className="mb-3 w-full rounded-lg border border-slate-300 p-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Thumbnail URL (e.g. https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg)"
          className="mb-4 w-full rounded-lg border border-slate-300 p-3"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />

        {sections.map((section, i) => (
          <div key={i} className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

            <input
              placeholder="Section Title"
              className="mb-3 w-full rounded-lg border border-slate-300 p-3"
              value={section.title}
              onChange={(e) => updateSectionTitle(i, e.target.value)}
            />

            {section.lectures.map((lec, j) => (
              <div key={j} className="mb-3 rounded-lg border border-slate-200 bg-white p-3">

                <input
                  placeholder="Lecture Title"
                  className="mb-2 w-full rounded-md border border-slate-300 p-2"
                  value={lec.title}
                  onChange={(e) =>
                    updateLecture(i, j, "title", e.target.value)
                  }
                />

                <input
                  placeholder="YouTube Video URL"
                  className="w-full rounded-md border border-slate-300 p-2"
                  value={lec.videoUrl}
                  onChange={(e) =>
                    updateLecture(i, j, "videoUrl", e.target.value)
                  }
                />

              </div>
            ))}

            <button
              onClick={() => addLecture(i)}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              + Add Lecture
            </button>

          </div>
        ))}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={addSection}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              + Add Section
            </button>

            <button
              onClick={handleCreate}
              className="rounded-lg bg-violet-600 px-4 py-2 font-semibold text-white transition hover:bg-violet-700"
            >
              Create Course
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-slate-900">Create Course Quiz</h3>
          <select
            className="mb-3 w-full rounded-lg border border-slate-300 p-3"
            value={quizCourseId}
            onChange={(e) => setQuizCourseId(e.target.value)}
          >
            <option value="">Select Course</option>
            {allCourses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
          <input
            placeholder="Quiz Title"
            className="mb-4 w-full rounded-lg border border-slate-300 p-3"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />

          {quizQuestions.map((question, qIndex) => (
            <div key={qIndex} className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <input
                placeholder={`Question ${qIndex + 1}`}
                className="mb-3 w-full rounded-lg border border-slate-300 p-3"
                value={question.question}
                onChange={(e) => updateQuizQuestion(qIndex, "question", e.target.value)}
              />
              <div className="grid gap-2 md:grid-cols-2">
                {question.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    placeholder={`Option ${optionIndex + 1}`}
                    className="rounded-md border border-slate-300 p-2"
                    value={option}
                    onChange={(e) => updateQuizOption(qIndex, optionIndex, e.target.value)}
                  />
                ))}
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Correct Option (0-3)
                </label>
                <input
                  type="number"
                  min={0}
                  max={3}
                  className="w-24 rounded-md border border-slate-300 p-2"
                  value={question.correctAnswer}
                  onChange={(e) => updateQuizQuestion(qIndex, "correctAnswer", Number(e.target.value))}
                />
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={addQuizQuestion}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              + Add Question
            </button>
            <button
              onClick={handleCreateQuiz}
              className="rounded-lg bg-violet-600 px-4 py-2 font-semibold text-white transition hover:bg-violet-700"
            >
              Create Quiz
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorDashboard;