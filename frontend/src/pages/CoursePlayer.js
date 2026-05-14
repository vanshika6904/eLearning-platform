import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { demoCourses } from "../data/demoCourses";
import { getYoutubeVideoId, toYoutubeEmbedUrl, getVideoThumbnail } from "../utils/video";

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [video, setVideo] = useState("");
  const [selectedLectureTitle, setSelectedLectureTitle] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      if (id.startsWith("demo-")) {
        const demoCourse = demoCourses.find((item) => item._id === id);
        setCourse(demoCourse || null);
        const firstLecture = demoCourse?.sections?.[0]?.lectures?.[0];
        if (firstLecture) {
          setVideo(firstLecture.videoUrl);
          setSelectedLectureTitle(firstLecture.title);
        }
        return;
      }

      try {
        const res = await API.get(`/courses/${id}`);
        setCourse(res.data);
        const firstLecture = res.data.sections?.[0]?.lectures?.[0];
        if (firstLecture) {
          setVideo(firstLecture.videoUrl);
          setSelectedLectureTitle(firstLecture.title);
        }
      } catch (error) {
        const fallback = demoCourses[0];
        setCourse(fallback);
        setVideo(fallback.sections[0].lectures[0].videoUrl);
        setSelectedLectureTitle(fallback.sections[0].lectures[0].title);
      }
    };

    loadCourse();
  }, [id]);

  if (!course) return <p className="p-6">Loading...</p>;

  const youtubeId = getYoutubeVideoId(video);
  const youtubeEmbedUrl = toYoutubeEmbedUrl(video, true);

  return (
    <>
      <Navbar />

      <main className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-12">
        <aside className="order-2 border-r border-slate-200/70 bg-white/80 p-4 backdrop-blur lg:order-1 lg:col-span-4 xl:col-span-3">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Course Content</h2>

          {course.sections?.map((section, i) => (
            <section key={i} className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h3 className="mb-2 font-semibold text-slate-900">{section.title}</h3>

              {section.lectures?.map((lec, j) => (
                <button
                  key={j}
                  className={`mb-2 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition ${
                    selectedLectureTitle === lec.title
                      ? "bg-violet-100 text-violet-800"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => {
                    setVideo(lec.videoUrl);
                    setSelectedLectureTitle(lec.title);
                  }}
                >
                  <img
                    src={getVideoThumbnail(lec.videoUrl, "https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg")}
                    alt={lec.title}
                    className="h-10 w-16 rounded object-cover"
                  />
                  <span>{lec.title}</span>
                </button>
              ))}
            </section>
          ))}
        </aside>

        <section className="order-1 p-4 md:p-8 lg:order-2 lg:col-span-8 xl:col-span-9">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="mb-1 text-3xl font-black text-slate-900">{course.title}</h2>
              <p className="text-slate-600">{selectedLectureTitle || "Lecture"}</p>
            </div>
            <button
              onClick={() => navigate(`/quiz/${id}`)}
              className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-fuchsia-700"
            >
              Take Quiz
            </button>
          </div>

          {youtubeId && youtubeEmbedUrl ? (
            <iframe
              className="aspect-video w-full rounded-2xl border border-slate-200 bg-black shadow-sm"
              src={youtubeEmbedUrl}
              title={selectedLectureTitle || "Course video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video controls className="aspect-video w-full rounded-2xl border border-slate-200 bg-black shadow-sm">
              <source src={video} />
            </video>
          )}
        </section>
      </main>
    </>
  );
};

export default CoursePlayer;