import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const role = localStorage.getItem("role"); // ✅ MOVE HERE

  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <h1
          className="cursor-pointer text-2xl font-black tracking-tight text-slate-900"
          onClick={() => navigate("/dashboard")}
        >
          learn<span className="text-violet-600">hub</span>
        </h1>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-slate-300/80 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            Courses
          </button>

          {role === "instructor" && (
            <button
              onClick={() => navigate("/instructor")}
              className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-fuchsia-700"
            >
              Instructor
            </button>
          )}

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300/80 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;