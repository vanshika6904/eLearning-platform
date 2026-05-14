import { useState, useContext } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("role", res.data.user.role);
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-8 md:grid-cols-2">
        <section className="space-y-5">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            learn<span className="text-violet-600">hub</span>
          </h1>
          <h2 className="text-4xl font-bold leading-tight text-slate-900">
            Skills that move your career forward.
          </h2>
          <p className="max-w-lg text-lg text-slate-600">
            Learn with structured courses, practical lectures, and live quizzes in one modern learning space.
          </p>
          <div className="grid max-w-xl grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm">
              10,000+ learners
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm">
              Expert instructors
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm">
              Real-time quizzes
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm">
              Career-ready paths
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <h3 className="mb-6 text-2xl font-bold text-slate-900">Login to continue learning</h3>

          <input
            className="mb-3 w-full rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="mb-4 w-full rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Login
          </button>
        </section>
      </div>
    </div>
  );
};

export default Login;