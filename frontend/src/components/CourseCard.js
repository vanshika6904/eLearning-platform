import { getVideoThumbnail } from "../utils/video";

const CourseCard = ({ course, onAction, actionLabel = "Enroll" }) => {
  const thumbnail =
    course.thumbnail ||
    getVideoThumbnail(course.sections?.[0]?.lectures?.[0]?.videoUrl, "https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg");

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <img src={thumbnail} alt={course.title} className="h-44 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 to-transparent opacity-80" />
      </div>

      <div className="space-y-3 p-4">
        <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
        <p className="min-h-12 text-sm leading-6 text-slate-600">{course.description}</p>

        <div className="flex items-center justify-between pt-1">
          <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-700">Top Rated</span>
          <button
            onClick={onAction}
            className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-violet-700 hover:to-fuchsia-700"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
