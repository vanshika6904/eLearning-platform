import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { demoCourses } from "../data/demoCourses";
import CourseCard from "../components/CourseCard";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const navigate = useNavigate();
  const categories = [
    "All",
    "Web Development",
    "Data Science",
    "Marketing",
    "Design",
    "Business",
    "Personal Development"
  ];

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await API.get("/courses");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCourses(res.data);
          return;
        }
      } catch (error) {
        // Keep UI usable even if backend is unavailable.
      }
      setCourses(demoCourses);
    };

    loadCourses();
  }, []);

  const enroll = async (id) => {
    if (!id.startsWith("demo-")) {
      try {
        await API.post(`/courses/enroll/${id}`);
        setEnrolledCourseIds((prev) => [...new Set([...prev, id])]);
      } catch (error) {
        alert("Enrollment API failed. Opening course directly.");
      }
    }
    navigate(`/course/${id}`);
  };

  const visibleCourses = courses.filter((course, index) => {
    if (activeCategory === "All") return true;
    const inferredCategory = course.category || categories[(index % (categories.length - 1)) + 1];
    return inferredCategory === activeCategory;
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-violet-900 to-fuchsia-800 px-6 py-16 text-white md:px-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-3 text-4xl font-black leading-tight md:text-5xl">Keep learning with top-rated courses</h2>
            <p className="max-w-3xl text-lg text-violet-100">
              Discover practical courses designed by industry experts and level up at your own pace.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <h3 className="mb-4 text-2xl font-bold text-slate-900">Browse Categories</h3>
          <div className="mb-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`border px-4 py-2 rounded-full text-sm font-medium ${
                  activeCategory === category
                    ? "border-violet-600 bg-violet-600 text-white shadow-sm"
                    : "border-slate-300 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <h3 className="mb-5 text-2xl font-bold text-slate-900">Recommended for you</h3>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onAction={() => enroll(course._id)}
                actionLabel={enrolledCourseIds.includes(course._id) ? "Continue" : "Enroll"}
              />
            ))}
          </div>

          {visibleCourses.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-slate-500">
              No courses found in this category.
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Dashboard;