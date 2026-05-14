import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createSocket, disconnectSocket } from "../services/socket";
import API from "../services/api";

const QuizPage = () => {
  const socketRef = useRef(null);
  const { courseId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizError, setQuizError] = useState("");
  const quizRef = useRef(null);
  const answersRef = useRef([]);
  const submittedRef = useRef(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await API.get(`/quiz/${courseId}`);
        setQuiz(data);
        setAnswers(Array(data.questions.length).fill(null));
        quizRef.current = data;
        answersRef.current = Array(data.questions.length).fill(null);
      } catch (error) {
        setQuizError(error.response?.data?.message || "Quiz not available for this course.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [courseId]);

  const handleStartQuiz = () => {
    if (!quiz) return;
    const freshAnswers = Array(quiz.questions.length).fill(null);
    setStarted(true);
    startedRef.current = true;
    setSubmitted(false);
    submittedRef.current = false;
    setResult(null);
    setTimeLeft(60);
    setAnswers(freshAnswers);
    answersRef.current = freshAnswers;
    socketRef.current.emit("startQuiz", { quizId: quiz._id, duration: 60, forceRestart: true });
  };

  const selectAnswer = (questionIndex, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      answersRef.current = next;
      return next;
    });
  };

  const handleSubmit = async (autoSubmitted = false) => {
    const currentQuiz = quizRef.current;
    const currentAnswers = answersRef.current;
    if (!currentQuiz || submittedRef.current) return;

    if (!autoSubmitted && currentAnswers.some((answer) => answer === null)) {
      const proceed = window.confirm("Some questions are unanswered. Submit anyway?");
      if (!proceed) return;
    }

    try {
      setSubmitting(true);
      const { data } = await API.post("/quiz/submit", {
        quizId: currentQuiz._id,
        answers: currentAnswers
      });
      setResult(data);
      setSubmitted(true);
      submittedRef.current = true;
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    socketRef.current = createSocket();

    const onConnect = () => {
      // Rejoin and resync timer if socket reconnects mid-quiz.
      if (startedRef.current && quizRef.current && !submittedRef.current) {
        socketRef.current.emit("startQuiz", {
          quizId: quizRef.current._id,
          duration: 60,
          forceRestart: false
        });
      }
    };

    const onTimerUpdate = (time) => {
      setTimeLeft(Math.max(time, 0));
    };

    const onQuizEnded = () => {
      if (!submittedRef.current) {
        handleSubmit(true);
      }
    };

    socketRef.current.on("connect", onConnect);
    socketRef.current.on("timerUpdate", onTimerUpdate);
    socketRef.current.on("quizEnded", onQuizEnded);

    return () => {
      socketRef.current?.off("connect", onConnect);
      socketRef.current?.off("timerUpdate", onTimerUpdate);
      socketRef.current?.off("quizEnded", onQuizEnded);
      disconnectSocket();
    };
  }, []);

  const getOptionClass = (questionIndex, optionIndex) => {
    const baseClass =
      "w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition";

    if (!submitted) {
      return answers[questionIndex] === optionIndex
        ? `${baseClass} border-violet-500 bg-violet-100 text-violet-800`
        : `${baseClass} border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;
    }

    const qResult = result?.results?.[questionIndex];
    const isSelected = answers[questionIndex] === optionIndex;
    const isCorrect = qResult?.correctAnswer === optionIndex;

    if (isCorrect) return `${baseClass} border-emerald-500 bg-emerald-100 text-emerald-800`;
    if (isSelected && !qResult?.correct) return `${baseClass} border-rose-500 bg-rose-100 text-rose-800`;
    return `${baseClass} border-slate-200 bg-slate-50 text-slate-500`;
  };

  const progress = (timeLeft / 60) * 100;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-4xl p-6 text-slate-600">Loading quiz...</div>
      </>
    );
  }

  if (!quiz) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl p-6">
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-rose-800">Quiz Unavailable</h2>
            <p className="text-rose-700">{quizError || "This course does not have a quiz yet."}</p>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-5xl p-6">
        {!started && (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="mb-2 text-3xl font-black text-slate-900">{quiz?.title || "Course Quiz"}</h2>
            <p className="mb-6 text-slate-600">You have 60 seconds to complete this quiz.</p>
            <button
              onClick={handleStartQuiz}
              className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-fuchsia-700"
            >
              Start Quiz
            </button>
          </section>
        )}

        {started && (
          <>
            <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              {submitted && result && (
                <div className="mb-4 rounded-lg bg-gradient-to-r from-violet-50 to-fuchsia-50 p-4 text-violet-900">
                  <h3 className="text-xl font-bold">Score: {result.score} / {result.total}</h3>
                </div>
              )}
              <div className="mb-2 flex justify-between text-sm font-medium text-slate-600">
                <span>Time Left</span>
                <span>{timeLeft}s</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </section>

            <div className="space-y-4">
              {quiz?.questions?.map((q, questionIndex) => (
                <section key={questionIndex} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    Q{questionIndex + 1}. {q.question}
                  </h3>
                  <div className="grid gap-3">
                    {q.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => selectAnswer(questionIndex, optionIndex)}
                        className={getOptionClass(questionIndex, optionIndex)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {submitted && result && (
                    <p className="mt-3 text-sm font-medium text-slate-600">
                      Correct answer: {q.options[result.results[questionIndex].correctAnswer]}
                    </p>
                  )}
                </section>
              ))}
            </div>
            <div className="mt-6">
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitted || submitting}
                className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 font-semibold text-white transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:from-emerald-300 disabled:to-teal-300"
              >
                {submitting ? "Submitting..." : submitted ? "Quiz Submitted" : "Submit Quiz"}
              </button>
              {submitted && (
                <button
                  onClick={handleStartQuiz}
                  className="ml-3 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Take Quiz Again
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default QuizPage;